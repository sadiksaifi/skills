---
name: snap-forge
description: >
  Use when implementing a feature, bug fix, or refactor in a repository
---

Build the request one behavior at a time with red-green-refactor, testing only what earns a test:

```
checkout = current                # branch or worktree only when asked
keep unrelated changes untouched
context = walk(request)   # follow linked issues, PRs, specs, and docs, then their links; skip anything already read; stop at items that don't bear on intent
behaviors = split(request)        # ask only if a gap changes observable behavior or the public interface

for b in behaviors:
    if worth_test(b) and testable(b):
        red(b)                    # one test; fails because b is missing, not setup
        green(b)                  # smallest change that passes
    elif worth_test(b):
        agree verification with user; change
    else:
        change; verify with existing checks or observation
    commit(b)                     # one Conventional Commit; subject only unless the why is not obvious
    refactor()                    # while green; separate commit

run checks scoped to the change; read the diff
done = every behavior verified and committed, scoped checks pass

worth_test(b) = owned(b) and a plausible regression fails it and types, linters, inspection miss it
                # never: coverage, declarations, wiring, constants, trivial accessors, third-party behavior
```

Tests

- one behavior, public interface, survives refactors
- extend the existing suite first
- real owned code; doubles only at network, time, randomness
- expected values derived independently of the code under test
- real boundaries; no test-only production seams

Design

- narrow interface, deep implementation
- dependencies injected at boundaries
- explicit inputs, explicit results
- `refactor()`: duplication, shallow pass-throughs, mixed-purpose functions, primitive-heavy contracts
