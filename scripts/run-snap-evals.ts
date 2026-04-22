#!/usr/bin/env bun

import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { prepareFixture, type FixtureName } from "./snap-eval-fixtures";

type Variant = "with_skill" | "without_skill";

type EvalCase = {
  id: string;
  fixture?: FixtureName;
  prompt: string;
  expected_output: string;
  assertions: string[];
  verify_commands?: string[];
};

type Manifest = {
  skill_name: string;
  evals: EvalCase[];
};

type CodexRun = {
  exitCode: number;
  durationMs: number;
  stdout: string;
  stderr: string;
  finalMessage: string;
  usage: {
    input_tokens: number;
    cached_input_tokens: number;
    output_tokens: number;
} | null;
};

type AssertionResult = {
  text: string;
  passed: boolean;
  evidence: string;
};

type Grading = {
  assertion_results: AssertionResult[];
  summary: {
    passed: number;
    failed: number;
    total: number;
    pass_rate: number;
  };
  notes: string;
};

type RunSummary = {
  skill: string;
  eval_id: string;
  variant: Variant;
  repetition: number;
  duration_ms: number;
  exit_code: number;
  input_tokens: number;
  cached_input_tokens: number;
  output_tokens: number;
  assertions_passed: number;
  assertions_total: number;
  pass_rate: number;
  run_dir: string;
};

type DiscoveredManifest = {
  manifestPath: string;
  skillPath: string;
  manifest: Manifest;
};

type RunTask = {
  skillName: string;
  skillPath: string;
  evalCase: EvalCase;
  variant: Variant;
  repetition: number;
  runDir: string;
  repoDir: string;
  outputsDir: string;
  fixtureDir: string;
};

const SKILLS_ROOT = resolve(import.meta.dir, "..");
const DEFAULT_WORKSPACE_ROOT = join(tmpdir(), "snap-evals");

const GRADING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["assertion_results", "summary", "notes"],
  properties: {
    assertion_results: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["text", "passed", "evidence"],
        properties: {
          text: { type: "string" },
          passed: { type: "boolean" },
          evidence: { type: "string" },
        },
      },
    },
    summary: {
      type: "object",
      additionalProperties: false,
      required: ["passed", "failed", "total", "pass_rate"],
      properties: {
        passed: { type: "integer" },
        failed: { type: "integer" },
        total: { type: "integer" },
        pass_rate: { type: "number" },
      },
    },
    notes: { type: "string" },
  },
} as const;

function parseArgs(argv: string[]) {
  let repoPath = "";
  let workspaceRoot = DEFAULT_WORKSPACE_ROOT;
  let skillFilter = new Set<string>();
  let concurrency = 3;
  let repetitions = 1;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--repo") {
      repoPath = argv[i + 1] ?? "";
      i += 1;
      continue;
    }

    if (arg === "--workspace") {
      workspaceRoot = argv[i + 1] ?? workspaceRoot;
      i += 1;
      continue;
    }

    if (arg === "--skills") {
      const raw = argv[i + 1] ?? "";
      skillFilter = new Set(
        raw
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean),
      );
      i += 1;
      continue;
    }

    if (arg === "--concurrency") {
      const value = Number(argv[i + 1] ?? "");
      if (!Number.isInteger(value) || value < 1) {
        throw new Error("expected --concurrency to be an integer >= 1");
      }
      concurrency = value;
      i += 1;
      continue;
    }

    if (arg === "--repetitions") {
      const value = Number(argv[i + 1] ?? "");
      if (!Number.isInteger(value) || value < 1) {
        throw new Error("expected --repetitions to be an integer >= 1");
      }
      repetitions = value;
      i += 1;
      continue;
    }

  }

  if (!repoPath) {
    throw new Error("missing required --repo /abs/path/to/repo");
  }

  return {
    repoPath: resolve(repoPath),
    workspaceRoot: resolve(workspaceRoot),
    skillFilter,
    concurrency,
    repetitions,
  };
}

async function pathExists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function discoverManifests(skillFilter: Set<string>) {
  const entries = await readdir(SKILLS_ROOT, { withFileTypes: true });
  const manifests: DiscoveredManifest[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith("snap-")) {
      continue;
    }

    if (skillFilter.size > 0 && !skillFilter.has(entry.name)) {
      continue;
    }

    const skillPath = join(SKILLS_ROOT, entry.name);
    const manifestPath = join(skillPath, "evals", "evals.json");

    if (!(await pathExists(manifestPath))) {
      continue;
    }

    const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Manifest;
    manifests.push({ manifestPath, skillPath, manifest });
  }

  manifests.sort((a, b) => a.manifest.skill_name.localeCompare(b.manifest.skill_name));
  return manifests;
}

function stamp() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[:]/g, "");
}

function slug(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function shortCommandName(command: string, index: number) {
  const hash = Bun.hash(command).toString(16);
  const clipped = slug(command).slice(0, 48).replace(/-+$/g, "");
  return `${String(index + 1).padStart(2, "0")}-${clipped}-${hash}`;
}

async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

function repeatLabel(repetition: number, repetitions: number) {
  if (repetitions === 1) {
    return "";
  }

  return `attempt-${String(repetition).padStart(2, "0")}`;
}

async function runCommand(command: string, cwd: string) {
  const proc = Bun.spawn(["zsh", "-lc", command], {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
    env: process.env,
  });
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  const exitCode = await proc.exited;
  return { exitCode, stdout, stderr };
}

async function buildSourceContext(repoDir: string) {
  const gitFiles = await runCommand("git ls-tree -r --name-only HEAD", repoDir);
  const readme = await readIfExists(join(repoDir, "README.md"));
  const claude = await readIfExists(join(repoDir, "CLAUDE.md"));

  return [
    "# Source Context",
    "",
    "## Tracked Files",
    gitFiles.stdout.trim() || "(none)",
    "",
    "## README.md",
    readme.trim() || "(missing)",
    "",
    "## CLAUDE.md",
    claude.trim() || "(missing)",
    "",
  ].join("\n");
}

async function readIfExists(path: string) {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

function buildPrompt(
  skillName: string,
  skillPath: string,
  variant: Variant,
  promptTemplate: string,
  repoDir: string,
) {
  const prefix =
    variant === "with_skill" ? `Use $${skillName} at ${skillPath}.\n\n` : "";

  return `${prefix}${promptTemplate.replaceAll("{{repo_path}}", repoDir)}`;
}

function extractFinalMessage(lines: string[]) {
  let finalMessage = "";
  let usage: CodexRun["usage"] = null;

  for (const line of lines) {
    if (!line.startsWith("{")) {
      continue;
    }

    const parsed = JSON.parse(line) as Record<string, unknown>;

    if (parsed.type === "item.completed") {
      const item = parsed.item as Record<string, unknown>;
      if (item.type === "agent_message") {
        finalMessage = String(item.text ?? "");
      }
    }

    if (parsed.type === "turn.completed") {
      const rawUsage = parsed.usage as Record<string, number> | undefined;
      if (rawUsage) {
        usage = {
          input_tokens: rawUsage.input_tokens ?? 0,
          cached_input_tokens: rawUsage.cached_input_tokens ?? 0,
          output_tokens: rawUsage.output_tokens ?? 0,
        };
      }
    }
  }

  return { finalMessage, usage };
}

async function runCodex(prompt: string, cwd: string, extraArgs: string[] = []) {
  const startedAt = Date.now();
  const signal = AbortSignal.timeout(10 * 60 * 1000);
  const proc = Bun.spawn(
    [
      "codex",
      "-a",
      "never",
      "exec",
      "--json",
      "--color",
      "never",
      "--ephemeral",
      "--sandbox",
      "workspace-write",
      "--add-dir",
      SKILLS_ROOT,
      "-C",
      cwd,
      ...extraArgs,
      "-",
    ],
    {
      cwd,
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
      env: process.env,
      signal,
    },
  );

  proc.stdin?.write(prompt);
  proc.stdin?.end();

  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  const exitCode = await proc.exited;
  const durationMs = Date.now() - startedAt;

  const lines = stdout.split(/\r?\n/).filter(Boolean);
  const { finalMessage, usage } = extractFinalMessage(lines);

  return {
    exitCode,
    durationMs,
    stdout,
    stderr,
    finalMessage,
    usage,
  } satisfies CodexRun;
}

async function captureGitArtifacts(
  repoDir: string,
  outputsDir: string,
  baseCommit: string,
) {
  const headCommit = (await runCommand("git rev-parse HEAD", repoDir)).stdout.trim();

  await runCommand("git add -N .", repoDir);

  const [
    status,
    workingPatch,
    workingStat,
    diffFromBase,
    diffStatFromBase,
    logSinceBase,
  ] = await Promise.all([
    runCommand("git status --short", repoDir),
    runCommand("git diff --binary", repoDir),
    runCommand("git diff --stat", repoDir),
    headCommit === baseCommit
      ? Promise.resolve({ exitCode: 0, stdout: "", stderr: "" })
      : runCommand(`git diff --binary ${baseCommit}..${headCommit}`, repoDir),
    headCommit === baseCommit
      ? Promise.resolve({ exitCode: 0, stdout: "", stderr: "" })
      : runCommand(`git diff --stat ${baseCommit}..${headCommit}`, repoDir),
    headCommit === baseCommit
      ? Promise.resolve({ exitCode: 0, stdout: "", stderr: "" })
      : runCommand(`git log --oneline ${baseCommit}..${headCommit}`, repoDir),
  ]);

  await writeFile(join(outputsDir, "git-status.txt"), status.stdout);
  await writeFile(join(outputsDir, "git-working-tree.patch"), workingPatch.stdout);
  await writeFile(join(outputsDir, "git-working-tree.stat.txt"), workingStat.stdout);
  await writeFile(join(outputsDir, "git-diff-from-base.patch"), diffFromBase.stdout);
  await writeFile(join(outputsDir, "git-diff-from-base.stat.txt"), diffStatFromBase.stdout);
  await writeFile(join(outputsDir, "git-log-since-base.txt"), logSinceBase.stdout);
  await writeFile(
    join(outputsDir, "git-head.json"),
    JSON.stringify({ base_commit: baseCommit, head_commit: headCommit }, null, 2),
  );
}

async function runVerifyCommands(
  commands: string[] | undefined,
  repoDir: string,
  outputsDir: string,
) {
  if (!commands || commands.length === 0) {
    return [];
  }

  const results = [];

  for (let index = 0; index < commands.length; index += 1) {
    const command = commands[index];
    const result = await runCommand(command, repoDir);
    const baseName = shortCommandName(command, index);
    await writeFile(join(outputsDir, `${baseName}.stdout.txt`), result.stdout);
    await writeFile(join(outputsDir, `${baseName}.stderr.txt`), result.stderr);
    results.push({
      command,
      exit_code: result.exitCode,
      stdout_file: `${baseName}.stdout.txt`,
      stderr_file: `${baseName}.stderr.txt`,
    });
  }

  await writeFile(join(outputsDir, "verify-results.json"), JSON.stringify(results, null, 2));
  return results;
}

async function readArtifactsForJudge(outputsDir: string) {
  const files = (await readdir(outputsDir)).sort();
  const parts: string[] = [];

  for (const file of files) {
    const path = join(outputsDir, file);
    const fileStat = await stat(path);

    if (!fileStat.isFile()) {
      continue;
    }

    const raw = await readFile(path, "utf8");
    if (raw.length > 40_000) {
      parts.push(`=== ${file} ===\n${raw.slice(0, 40_000)}\n[truncated]\n`);
    } else {
      parts.push(`=== ${file} ===\n${raw}\n`);
    }
  }

  return parts.join("\n");
}

function failingGrade(assertions: string[], reason: string): Grading {
  const assertion_results = assertions.map((text) => ({
    text,
    passed: false,
    evidence: reason,
  }));

  return {
    assertion_results,
    summary: {
      passed: 0,
      failed: assertions.length,
      total: assertions.length,
      pass_rate: 0,
    },
    notes: reason,
  };
}

async function gradeRun(
  skillName: string,
  evalCase: EvalCase,
  outputsDir: string,
  schemaPath: string,
) {
  const artifacts = await readArtifactsForJudge(outputsDir);
  const prompt = [
    "Grade one skill evaluation run.",
    "Use only provided artifacts. Be strict. If evidence is absent, fail the assertion.",
    "",
    `Skill: ${skillName}`,
    `Expected output: ${evalCase.expected_output}`,
    "Assertions:",
    ...evalCase.assertions.map((assertion, index) => `${index + 1}. ${assertion}`),
    "",
    "Artifacts:",
    artifacts,
  ].join("\n");

  const result = await runCodex(prompt, outputsDir, [
    "--skip-git-repo-check",
    "--output-schema",
    schemaPath,
  ]);

  await writeFile(join(outputsDir, "grading-raw.stdout.jsonl"), result.stdout);
  await writeFile(join(outputsDir, "grading-raw.stderr.txt"), result.stderr);

  if (result.exitCode !== 0 || !result.finalMessage.trim()) {
    return failingGrade(
      evalCase.assertions,
      `grading run failed: exit=${result.exitCode}`,
    );
  }

  try {
    return JSON.parse(result.finalMessage) as Grading;
  } catch {
    return failingGrade(evalCase.assertions, "grading output was not valid JSON");
  }
}

function mean(values: number[]) {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function runPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function consume() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;

      if (index >= items.length) {
        return;
      }

      results[index] = await worker(items[index], index);
    }
  }

  const workerCount = Math.min(limit, Math.max(items.length, 1));
  await Promise.all(Array.from({ length: workerCount }, () => consume()));
  return results;
}

function buildTasks(
  manifests: DiscoveredManifest[],
  suiteRoot: string,
  repetitions: number,
) {
  const tasks: RunTask[] = [];

  for (const { skillPath, manifest } of manifests) {
    const skillRoot = join(suiteRoot, manifest.skill_name);

    for (const evalCase of manifest.evals) {
      for (const variant of ["with_skill", "without_skill"] as const) {
        for (let repetition = 1; repetition <= repetitions; repetition += 1) {
          const baseDir = join(skillRoot, `eval-${slug(evalCase.id)}`, variant);
          const runDir = repeatLabel(repetition, repetitions)
            ? join(baseDir, repeatLabel(repetition, repetitions))
            : baseDir;

          tasks.push({
            skillName: manifest.skill_name,
            skillPath,
            evalCase,
            variant,
            repetition,
            runDir,
            repoDir: join(runDir, "repo"),
            outputsDir: join(runDir, "outputs"),
            fixtureDir: join(runDir, "fixture"),
          });
        }
      }
    }
  }

  return tasks;
}

async function executeTask(
  task: RunTask,
  repoPath: string,
  schemaPath: string,
) {
  console.error(
    `[run] ${task.skillName} ${task.evalCase.id} ${task.variant} r${task.repetition} -> ${task.runDir}`,
  );

  await ensureDir(task.outputsDir);
  await prepareFixture({
    fixtureName: task.evalCase.fixture ?? "clean-scaffold",
    providedRepoPath: repoPath,
    repoDir: task.repoDir,
    fixtureDir: task.fixtureDir,
  });

  const sourceContext = await buildSourceContext(task.repoDir);
  await writeFile(join(task.outputsDir, "source-context.txt"), sourceContext);

  const baseCommit = (await runCommand("git rev-parse HEAD", task.repoDir)).stdout.trim();
  const prompt = buildPrompt(
    task.skillName,
    task.skillPath,
    task.variant,
    task.evalCase.prompt,
    task.repoDir,
  ).replaceAll("{{fixture_path}}", task.fixtureDir);

  await writeFile(join(task.outputsDir, "prompt.txt"), prompt);

  const run = await runCodex(prompt, task.repoDir);

  await writeFile(join(task.outputsDir, "agent-raw.stdout.jsonl"), run.stdout);
  await writeFile(join(task.outputsDir, "agent-raw.stderr.txt"), run.stderr);
  await writeFile(join(task.outputsDir, "final-response.md"), run.finalMessage);
  await writeFile(
    join(task.outputsDir, "timing.json"),
    JSON.stringify(
      {
        duration_ms: run.durationMs,
        exit_code: run.exitCode,
        usage: run.usage,
      },
      null,
      2,
    ),
  );

  await captureGitArtifacts(task.repoDir, task.outputsDir, baseCommit);
  await runVerifyCommands(task.evalCase.verify_commands, task.repoDir, task.outputsDir);

  console.error(
    `[grade] ${task.skillName} ${task.evalCase.id} ${task.variant} r${task.repetition} -> ${task.outputsDir}`,
  );

  const grading =
    run.exitCode === 0
      ? await gradeRun(task.skillName, task.evalCase, task.outputsDir, schemaPath)
      : failingGrade(task.evalCase.assertions, `agent run failed: exit=${run.exitCode}`);

  await writeFile(join(task.outputsDir, "grading.json"), JSON.stringify(grading, null, 2));

  const summary: RunSummary = {
    skill: task.skillName,
    eval_id: task.evalCase.id,
    variant: task.variant,
    repetition: task.repetition,
    duration_ms: run.durationMs,
    exit_code: run.exitCode,
    input_tokens: run.usage?.input_tokens ?? 0,
    cached_input_tokens: run.usage?.cached_input_tokens ?? 0,
    output_tokens: run.usage?.output_tokens ?? 0,
    assertions_passed: grading.summary.passed,
    assertions_total: grading.summary.total,
    pass_rate: grading.summary.pass_rate,
    run_dir: task.runDir,
  };

  await writeFile(join(task.runDir, "benchmark.json"), JSON.stringify(summary, null, 2));
  return summary;
}

function benchmarkForSkill(skillName: string, skillRuns: RunSummary[]) {
  const withSkillRuns = skillRuns.filter((summary) => summary.variant === "with_skill");
  const withoutSkillRuns = skillRuns.filter(
    (summary) => summary.variant === "without_skill",
  );

  return {
    skill: skillName,
    run_count: skillRuns.length,
    with_skill: {
      avg_pass_rate: mean(withSkillRuns.map((run) => run.pass_rate)),
      avg_duration_ms: mean(withSkillRuns.map((run) => run.duration_ms)),
      avg_output_tokens: mean(withSkillRuns.map((run) => run.output_tokens)),
    },
    without_skill: {
      avg_pass_rate: mean(withoutSkillRuns.map((run) => run.pass_rate)),
      avg_duration_ms: mean(withoutSkillRuns.map((run) => run.duration_ms)),
      avg_output_tokens: mean(withoutSkillRuns.map((run) => run.output_tokens)),
    },
    delta: {
      pass_rate:
        mean(withSkillRuns.map((run) => run.pass_rate)) -
        mean(withoutSkillRuns.map((run) => run.pass_rate)),
      duration_ms:
        mean(withSkillRuns.map((run) => run.duration_ms)) -
        mean(withoutSkillRuns.map((run) => run.duration_ms)),
      output_tokens:
        mean(withSkillRuns.map((run) => run.output_tokens)) -
        mean(withoutSkillRuns.map((run) => run.output_tokens)),
    },
    runs: skillRuns,
  };
}

async function writeSummaryMarkdown(
  suiteRoot: string,
  summaries: RunSummary[],
  skillBenchmarks: Record<string, unknown>,
) {
  const lines = [
    "# Snap Eval Summary",
    "",
    "| Skill | Variant | Pass Rate | Duration (s) | Output Tokens | Run Dir |",
    "| --- | --- | ---: | ---: | ---: | --- |",
  ];

  for (const summary of summaries) {
    lines.push(
      `| ${summary.skill} | ${summary.variant} | ${summary.pass_rate.toFixed(2)} | ${(summary.duration_ms / 1000).toFixed(1)} | ${summary.output_tokens} | ${summary.run_dir} |`,
    );
  }

  lines.push("");
  lines.push("## Benchmarks");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(skillBenchmarks, null, 2));
  lines.push("```");
  lines.push("");

  await writeFile(join(suiteRoot, "summary.md"), lines.join("\n"));
}

async function main() {
  const { repoPath, workspaceRoot, skillFilter, concurrency, repetitions } = parseArgs(
    process.argv.slice(2),
  );
  const manifests = await discoverManifests(skillFilter);

  if (manifests.length === 0) {
    throw new Error("no snap eval manifests found");
  }

  const iteration = `iteration-${stamp()}`;
  const suiteRoot = join(workspaceRoot, iteration);
  const schemaPath = join(suiteRoot, "grading.schema.json");
  const skillBenchmarks: Record<string, unknown> = {};
  const tasks = buildTasks(manifests, suiteRoot, repetitions);

  await ensureDir(suiteRoot);
  await writeFile(schemaPath, JSON.stringify(GRADING_SCHEMA, null, 2));
  await Promise.all(
    manifests.map(({ manifest }) => ensureDir(join(suiteRoot, manifest.skill_name))),
  );

  const summaries = await runPool(tasks, concurrency, (task) =>
    executeTask(task, repoPath, schemaPath),
  );

  summaries.sort((a, b) => {
    return (
      a.skill.localeCompare(b.skill) ||
      a.eval_id.localeCompare(b.eval_id) ||
      a.variant.localeCompare(b.variant) ||
      a.repetition - b.repetition
    );
  });

  for (const { manifest } of manifests) {
    const skillRoot = join(suiteRoot, manifest.skill_name);
    const skillRuns = summaries.filter((summary) => summary.skill === manifest.skill_name);
    const benchmark = benchmarkForSkill(manifest.skill_name, skillRuns);

    skillBenchmarks[manifest.skill_name] = benchmark;
    await writeFile(join(skillRoot, "benchmark.json"), JSON.stringify(benchmark, null, 2));
    console.error(`[done] ${manifest.skill_name} -> ${join(skillRoot, "benchmark.json")}`);
  }

  const suiteBenchmark = {
    suite_root: suiteRoot,
    repo_path: repoPath,
    concurrency,
    repetitions,
    runs: summaries,
    skills: skillBenchmarks,
  };

  await writeFile(join(suiteRoot, "benchmark.json"), JSON.stringify(suiteBenchmark, null, 2));
  await writeSummaryMarkdown(suiteRoot, summaries, skillBenchmarks);

  console.log(JSON.stringify({ suite_root: suiteRoot, run_count: summaries.length }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
