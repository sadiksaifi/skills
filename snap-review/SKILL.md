---
name: snap-review
description: >
  Use when the user asks to review a PR, branch, commit, local changes, or files, or whether a change is safe to merge
---

Review the target read-only. Weigh overbuilding and architecture as heavily as correctness:

```
target = PR | branch vs base | commit or range | staged or uncommitted | named paths   # from request, branch, or session; ask only when none
context = intent, base/head, diff, changed files, commits
if PR: context += checks, reviews, comments, unresolved threads
context += walk(target)   # follow linked issues, PRs, specs, and docs, then their links; skip anything already read; stop at items that don't bear on intent
named paths without a diff count as changed
read the repo instructions governing each changed path
if critical context is missing or conflicting: output "Review blocked: [reason]"; stop

for path in changed paths:
    apply every lens; trace changed behavior through callers and boundaries
    map each added or changed test to the regression it catches, or mark it low-value
repeat prior feedback only when still present and unresolved
findings = issues passing gate(), one per root cause, anchored on the tightest honest changed line
doubts failing gate() -> Risks / Unknowns
plain(report, comments)   # everyday words; one idea per sentence; cut each sentence that changes nothing the reader knows or does; the shortest comment that states the failure and fix

if no findings: output exactly "No Findings"
else: findings template, ordered by priority, then path

if PR and findings and the user did not ask to hold or skip posting:
    post each inlineable finding as a comment
# holding: report locally and wait for approval
# unknowns alone and pending checks are never posted

done = every changed path and lens accounted for; every finding passes gate()
```

`gate(issue)`: present in the diff or still unresolved; reached by a supported input or realistic condition; concrete correctness, security, testability, maintenance, or future-change cost; mechanism proven by cited evidence; fix aimed at the root cause.

## Lenses

Behavior

- correctness: inputs, outputs, validation, errors, state transitions, persistence, edge paths
- security and privacy: authentication, authorization, trust boundaries, secrets, sensitive data flow
- concurrency and lifecycle: races, retries, idempotency, cancellation, cleanup, resource ownership
- compatibility: interfaces, migrations, rollout order, old callers, persisted formats
- performance: hot paths, query or network amplification, blocking work, memory, unbounded growth
- operations: failure visibility, recovery, configuration, deployment assumptions

Overbuilding

- ask: could less code solve this correctly?
- every abstraction, wrapper, helper, layer, file, defensive branch, and test serves a present requirement, invariant, or variation point
- edge-case handling for states no supported input reaches
- checks the types, callers, or framework already guarantee
- low-value tests (see Tests)
- a large diff is a signal to inspect, not a finding by itself
- fix by deleting, inlining, reusing, or simplifying

Tests

- missing coverage: a plausible regression in owned behavior with no durable public-interface evidence; title it `Missing regression coverage` and name the regression
- a bug-fix test exercises the former failure path
- low-value: duplicates evidence, varies inputs without reaching a new branch, restates third-party behavior or static checks, or passes when its claimed behavior breaks (self-comparisons, expected values from the code under test, mocks supplying the asserted result, negatives passing at the wrong guard)
- implementation-detail assertions and test-only production seams
- fix by deleting down to the smallest set that keeps distinct evidence

Architecture

- depth: substantial behavior behind a small interface
- interface: callers learn only necessary invariants, errors, ordering, configuration, and performance
- seams: only for real variation
- locality: policy and change stay concentrated, not spread across callers
- testability: callers and tests share the public interface
- deletion test: if removing a module makes its complexity vanish rather than reappear in callers, it is a shallow pass-through
- duplicated policy, leaky adapters, vendor or storage shapes in domain logic, misplaced behavior

## Templates

- `P0`: merge blocker: data loss, security or privacy breach, broken core path
- `P1`: likely user-visible regression, contract break, or important missing coverage
- `P2`: bounded risk in an edge case, performance, compatibility, architecture, overbuilding, or testability

```markdown
## Findings

### P1: [defect title]

- Location: `path/to/file.ts:42`
- Failure: [trigger, mechanism, evidence]
- Impact: [consequence]
- Fix: [direction, no patch]

## Risks / Unknowns

- [doubt; drop the section when empty]
```

Comment, built from one finding:

```markdown
**P1: [defect title]**

[Failure and Impact as prose.]

**Fix:** [Fix]

Reviewed by {agent-harness} using {model-slug}.
```

`{agent-harness}` and `{model-slug}`: exact product name and model id from runtime metadata; ask before posting when either is missing.

```
anchor = root-cause changed line   # RIGHT for head lines, LEFT for removed lines; multi-line needs start_line and start_side inside the diff
if anchor rejected: retry once on the nearest honest changed line, else keep the finding local

# comment.json = {"body", "commit_id": reviewed head SHA, "path", "line", "side"}
gh api --method POST "repos/$owner/$repo/pulls/$pr/comments" --input comment.json --jq .html_url

confirm each comment exists; return its URL   # on failure, report it; the local report stays authoritative
```
