---
name: snap-review
description: >
  Use when a GitHub pull request needs a read-only pre-merge review for material
  correctness, security, privacy, performance, compatibility, architecture, or
  regression-test risks, or when the user asks whether a PR is safe to merge.
---

Read-only: inspect and report; leave the branch unchanged. Correctness is necessary, not sufficient: architecture is a first-class review surface.

## Invocation

Syntax: `/skill:snap-review [help] [ask]`

Bare keys mean `true`. `help` prints usage and stops. Unsafe unknown arguments stop with usage.

## Args

| Key | Values | Default | Effect |
| --- | --- | --- | --- |
| `help` | bool | false | print usage; do not execute |
| `ask` | bool | false | wait for approval before posting findings |

## Routes

| Selector | Posting |
| --- | --- |
| default | post qualifying findings automatically |
| `ask` | report locally and wait before posting |

`No Findings`, unknowns alone, and pending checks never qualify for posting.

## Workflow

1. **Target.** Identify the PR from branch or session context. Ask only when neither provides one.

2. **Context.** Reuse current context, then gather the PR intent, base/head, diff, changed files, checks, commits, reviews, comments, and unresolved threads.
   Follow linked material only when it changes scope or acceptance. Read repository instructions governing each changed path. Report a blocker when critical context remains inaccessible or conflicting.

3. **Review.** Apply the behavior, change economy, tests, and architecture sections of [`references/lenses.md`](references/lenses.md) to every changed path. Review correctness and architecture independently.
   For architecture, inspect whether modules hide substantial implementation behind narrow interfaces, seams represent real variation, policy stays local, and callers and tests share the public interface.
   Trace changed behavior through affected callers and boundaries. Account for prior feedback and current replies; repeat only issues that remain present and unresolved. Keep one finding per root cause and cite the tightest honest changed-line anchor.

4. **Finding gate.** A finding must identify a concrete failure path or material engineering risk introduced or left unresolved by the PR, supported by code or context evidence.
   Put uncertainty without that proof in `Risks / Unknowns`. Deduplicate symptoms before reporting.

5. **Report.** After every changed path and applicable lens is accounted for:
   - complete review with no findings: output exactly `No Findings`
   - findings present: use [`references/template.md`](references/template.md)
   - incomplete review: report `Review blocked: [reason]`

6. **Post.** A qualifying review contains at least one priority finding. Post its inlineable findings automatically on the default route. On `ask`, report locally and wait. An explicit instruction not to post always stops after the local report. Follow [`references/posting.md`](references/posting.md) and return each posted comment URL.

Completion: every changed path is reviewed for behavior, change economy, architecture, intent, and applicable repository rules; every added or materially changed test is mapped to distinct behavioral or regression evidence or classified as low-value; prior feedback is deduplicated; and every finding is material, located, evidence-backed, and actionable.
