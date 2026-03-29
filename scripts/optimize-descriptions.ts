#!/usr/bin/env bun
/**
 * Skill description optimizer using Claude Agent SDK.
 * No API key needed — uses existing Claude Code auth.
 *
 * Usage: bun run scripts/optimize-descriptions.ts --skill <path> --evals <path> [--iterations 3] [--model sonnet]
 */
import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync, writeFileSync, mkdirSync, unlinkSync, existsSync } from "fs";
import { join, basename, resolve } from "path";
import { randomBytes } from "crypto";

// ── Args ──
const args = process.argv.slice(2);
const getArg = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const skillPath = resolve(getArg("skill") ?? "");
const evalsPath = resolve(getArg("evals") ?? "");
const maxIter = parseInt(getArg("iterations") ?? "3");
const model = getArg("model") ?? "sonnet";

if (!skillPath || !evalsPath) {
  console.error("Usage: bun run scripts/optimize-descriptions.ts --skill <path> --evals <path>");
  process.exit(1);
}

// ── Parse SKILL.md ──
const skillMd = readFileSync(join(skillPath, "SKILL.md"), "utf-8");
const fmMatch = skillMd.match(/^---\n([\s\S]*?)\n---/);
const skillName = fmMatch?.[1].match(/name:\s*(.+)/)?.[1].trim() ?? basename(skillPath);

function extractDescription(md: string): string {
  const fm = md.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  // Match indented continuation lines after description: > or description: >\n
  const multiline = fm.match(/description:\s*>?\s*\n((?:[ \t]+.+(?:\n|$))+)/);
  if (multiline) return multiline[1].replace(/\n\s*/g, " ").trim();
  const inline = fm.match(/description:\s*['"]?(.+?)['"]?\s*$/m);
  return inline?.[1].trim() ?? "";
}

// ── Eval set: load + split ──
const allEvals: { query: string; should_trigger: boolean }[] = JSON.parse(readFileSync(evalsPath, "utf-8"));
const split = <T>(arr: T[], r: number): [T[], T[]] => {
  const n = Math.ceil(arr.length * r);
  return [arr.slice(0, n), arr.slice(n)];
};
const pos = allEvals.filter((e) => e.should_trigger);
const neg = allEvals.filter((e) => !e.should_trigger);
const [trainPos, testPos] = split(pos, 0.6);
const [trainNeg, testNeg] = split(neg, 0.6);
const trainSet = [...trainPos, ...trainNeg];
const testSet = [...testPos, ...testNeg];

// ── Find project root ──
function findProjectRoot(): string {
  let dir = process.cwd();
  while (dir !== "/") {
    if (existsSync(join(dir, ".claude"))) return dir;
    dir = resolve(dir, "..");
  }
  return process.cwd();
}
const projectRoot = findProjectRoot();
const commandsDir = join(projectRoot, ".claude", "commands");
mkdirSync(commandsDir, { recursive: true });

// ── Test a single query for triggering ──
async function testTrigger(userQuery: string, description: string): Promise<boolean> {
  const uid = randomBytes(4).toString("hex");
  const cmdName = `${skillName}-eval-${uid}`;
  const cmdFile = join(commandsDir, `${cmdName}.md`);

  const indented = description.split("\n").join("\n  ");
  writeFileSync(
    cmdFile,
    `---\ndescription: |\n  ${indented}\n---\n\n# ${skillName}\n\nThis skill handles: ${description}\n`
  );

  const abortController = new AbortController();
  let triggered = false;

  try {
    for await (const msg of query({
      prompt: userQuery,
      options: {
        model,
        maxTurns: 1,
        cwd: projectRoot,
        abortController,
        settingSources: ["project"],
        // Intercept tool calls to detect triggering without blocking
        canUseTool: async (toolName, toolInput) => {
          const inputStr = JSON.stringify(toolInput ?? {});
          if (toolName === "Skill" && inputStr.includes(cmdName)) {
            triggered = true;
            // Abort immediately — we got what we needed
            setTimeout(() => abortController.abort(), 0);
            return { behavior: "deny" as const, message: "eval complete" };
          }
          if (toolName === "Read" && inputStr.includes(cmdName)) {
            triggered = true;
            setTimeout(() => abortController.abort(), 0);
            return { behavior: "deny" as const, message: "eval complete" };
          }
          // Any other tool = Claude chose not to use our skill
          setTimeout(() => abortController.abort(), 0);
          return { behavior: "deny" as const, message: "eval complete" };
        },
      },
    })) {
      // Just consume messages
    }
  } catch {
    // AbortError is expected
  } finally {
    try { unlinkSync(cmdFile); } catch {}
  }

  return triggered;
}

// ── Run eval set ──
interface EvalResult {
  query: string;
  should_trigger: boolean;
  triggered: boolean;
  pass: boolean;
}

async function runEval(description: string, evalSet: typeof allEvals): Promise<EvalResult[]> {
  const results: EvalResult[] = [];

  for (const item of evalSet) {
    const shortQ = item.query.slice(0, 60);
    try {
      const triggered = await testTrigger(item.query, description);
      const pass = item.should_trigger === triggered;
      results.push({ query: item.query, should_trigger: item.should_trigger, triggered, pass });
      console.log(`    ${pass ? "✓" : "✗"} ${item.should_trigger ? "T" : "F"} → ${triggered ? "T" : "F"} ${shortQ}...`);
    } catch (e) {
      results.push({ query: item.query, should_trigger: item.should_trigger, triggered: false, pass: !item.should_trigger });
      console.log(`    ✗ ERR ${shortQ}...`);
    }
  }

  return results;
}

// ── Improve description via Agent SDK ──
async function improveDescription(
  currentDesc: string,
  results: EvalResult[],
  history: { desc: string; score: string }[]
): Promise<string> {
  const failed = results.filter((r) => !r.pass);
  const failedTriggers = failed.filter((r) => r.should_trigger);
  const falseTriggers = failed.filter((r) => !r.should_trigger);

  let prompt = `You are optimizing a skill description for triggering accuracy.
The description appears in Claude's available_skills list. Claude decides whether to invoke based solely on title + description.

Current: "${currentDesc}"
Score: ${results.filter((r) => r.pass).length}/${results.length}
`;

  if (failedTriggers.length) {
    prompt += "\nFAILED TO TRIGGER (should have):\n";
    failedTriggers.forEach((r) => (prompt += `  - "${r.query.slice(0, 120)}"\n`));
  }
  if (falseTriggers.length) {
    prompt += "\nFALSE TRIGGERS (shouldn't have):\n";
    falseTriggers.forEach((r) => (prompt += `  - "${r.query.slice(0, 120)}"\n`));
  }
  if (history.length) {
    prompt += "\nPrevious attempts (try something structurally different):\n";
    history.forEach((h) => (prompt += `  [${h.score}] "${h.desc.slice(0, 100)}..."\n`));
  }

  prompt += `\nSkill content:\n${skillMd.slice(0, 2000)}

Write an improved description (100-200 words, under 1024 chars). Generalize from failures — don't overfit. Focus on user intent. Be distinctive. Respond with ONLY the description text, no quotes or tags.`;

  let result = "";
  for await (const msg of query({
    prompt,
    options: { model, maxTurns: 1 },
  })) {
    if ("result" in msg) result = (msg as any).result;
  }

  return result.trim().replace(/^["']|["']$/g, "") || currentDesc;
}

// ── Main loop ──
const workspace = join(skillPath, ".optimize-workspace");
mkdirSync(workspace, { recursive: true });

let currentDesc = extractDescription(skillMd);
let bestDesc = currentDesc;
let bestTestScore = -1;
const history: { desc: string; score: string }[] = [];

console.log(`\nOptimizing: ${skillName}`);
console.log(`Train: ${trainSet.length}, Test: ${testSet.length}, Iterations: ${maxIter}, Model: ${model}\n`);

for (let i = 1; i <= maxIter; i++) {
  console.log(`-- Iteration ${i}/${maxIter} --`);
  console.log(`  Desc: ${currentDesc.slice(0, 100)}...`);

  console.log("  Train:");
  const trainResults = await runEval(currentDesc, trainSet);
  const trainPassed = trainResults.filter((r) => r.pass).length;
  console.log(`  Train: ${trainPassed}/${trainSet.length}`);

  console.log("  Test:");
  const testResults = await runEval(currentDesc, testSet);
  const testPassed = testResults.filter((r) => r.pass).length;
  console.log(`  Test: ${testPassed}/${testSet.length}`);

  if (testPassed > bestTestScore) {
    bestTestScore = testPassed;
    bestDesc = currentDesc;
    console.log(`  * New best (test: ${testPassed}/${testSet.length})`);
  }

  writeFileSync(
    join(workspace, `iter-${i}.json`),
    JSON.stringify({ iteration: i, description: currentDesc, trainPassed, testPassed, trainResults, testResults }, null, 2)
  );

  if (trainPassed === trainSet.length && testPassed === testSet.length) {
    console.log("  Perfect -- done.\n");
    break;
  }

  if (i < maxIter) {
    console.log("  Improving...");
    history.push({ desc: currentDesc, score: `${trainPassed}/${trainSet.length}` });
    currentDesc = await improveDescription(currentDesc, trainResults, history);
    console.log(`  New: ${currentDesc.slice(0, 100)}...\n`);
  }
}

console.log(`\n=== RESULT ===`);
console.log(`Best test score: ${bestTestScore}/${testSet.length}`);
console.log(`Best description:\n${bestDesc}\n`);

writeFileSync(
  join(workspace, "result.json"),
  JSON.stringify({ skill: skillName, best_description: bestDesc, test_score: bestTestScore, test_total: testSet.length }, null, 2)
);
