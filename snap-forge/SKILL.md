---
name: snap-forge
description: >
  Use when meaningful feature, bug-fix, or refactor work must be implemented in
  a repository with established tests, even when TDD is not requested; also use
  for explicit TDD, red-green-refactor, or test-first work.
---

## Invocation

Syntax: `/skill:snap-forge [help] [branch[=name]] [worktree[=path]]`

Bare keys mean `true`. `help` prints usage and stops. Unsafe unknown arguments stop with usage.

## Args

| Key | Values | Default | Effect |
| --- | --- | --- | --- |
| `help` | bool | false | print usage; do not execute |
| `branch` | bool/text | false | derive a branch or use the supplied name |
| `worktree` | bool/text | false | derive a worktree path or use the supplied path |

## Routes

| Selector | Workspace |
| --- | --- |
| default | current checkout and branch |
| `branch` | requested or derived branch in the current checkout |
| `worktree` | isolated worktree with a derived branch |
| `branch` + `worktree` | requested branch in the requested or derived worktree |

A direct implementation request or manual invocation authorizes relevant edits, tests, and commits. Otherwise ask before mutation. Branch and worktree creation require the corresponding explicit selector.

## Workflow

1. **Scope.** Reuse current context and fetch cited sources only when needed. Inspect relevant code, tests, interfaces, ADRs, and domain language. Turn acceptance into an ordered behavior list.
   Apply the test threshold in [`references/testing.md`](references/testing.md) to each behavior. Ask only when a missing decision changes observable behavior or the public interface. Use [`references/design.md`](references/design.md) when the test seam is unclear.

2. **Workspace.** Prepare the selected route before editing. Preserve unrelated working-tree changes; ask one scope question when relevant and unrelated edits cannot be separated confidently.

3. **Vertical loop.** Apply the test threshold per behavior; one work item may mix direct and red-green cycles. Complete one behavior before starting the next.
   - **DIRECT:** below the test threshold, make the smallest change and verify it with existing checks or direct observation.
   - **RED:** for test-worthy behavior, write one public-interface test and confirm it fails for the intended reason.
   - **GREEN:** make the smallest implementation that passes; run the targeted test and relevant checks.
   - **COMMIT:** create one atomic Conventional Commit for the completed behavior.

4. **Refactor.** Stay green. When the work exposes duplication, a shallow seam, or awkward coupling, use [`references/design.md`](references/design.md), refactor in small verified steps, and commit material refactoring separately.

5. **Verify.** Run the relevant broader checks, inspect the final diff, and report behaviors delivered, commands run, commits, and blockers.

Completion: every selected behavior has proportionate evidence, relevant checks pass, unrelated work is untouched, and each completed behavior is committed.
