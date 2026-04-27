# SNAP — SNAP's Not A Prompt

Opinionated [Agent Skills](https://agentskills.io) for building software the way strong teams actually work: scope it, spec it, plan it, slice it, forge it, ship it, review it, resolve it.

## Skills

| Skill | Purpose |
|-------|---------|
| `snap-scope` | Relentless design interview — stress-test plans and architectures |
| `snap-prd` | Write PRDs through interview + codebase exploration → GitHub issue |
| `snap-plan` | Turn any GitHub issue into a phased implementation plan → issue comment |
| `snap-slice` | Break a PRD into vertical slice issues with FR/NFR coverage mapping |
| `snap-forge` | Strict TDD execution — RED-GREEN-VERIFY-COMMIT, refactor at end |
| `snap-ship` | Create and update GitHub PRs from diff analysis |
| `snap-review` | Read-only PR review — findings-first bugs, regressions, missing tests |
| `snap-resolve` | Resolve PR feedback — TDD fixes, reviewer replies, CI failures |

## Workflow

```
              You have an idea
                     |
        +------------+------------+
        |            |            |
   Need a PRD?   Have issue?   Small fix?
        |            |            |
        v            |            |
   snap-scope        |            |
   (stress-test)     |            |
        |            |            |
        v            |            |
    snap-prd         |            |
    (write PRD)      |            |
        |            |            |
   +----+----+       |            |
   |         |       |            |
   v         v       |            |
snap-plan  snap-slice |            |
(phases)  (issues)   |            |
   |         |       |            |
   +---------+-------+------------+
                     |
                     v
                snap-forge
              (TDD execute)
                     |
                     v
                 snap-ship
               (create PR)
                     |
                     v
               snap-review
            (read-only review)
                     |
                 feedback?
                     |
                     v
               snap-resolve
             (fix + reply)
                     |
                     v
              back to snap-ship
            (update PR description)
```

**Enter wherever your clarity starts:**

```
Vague idea:             snap-scope → snap-prd → snap-slice → snap-forge → snap-ship → snap-review
Have PRD, need slices:  snap-slice → snap-forge → snap-ship → snap-review
Have PRD, need plan:    snap-plan → snap-forge → snap-ship → snap-review
Have issue, ready:      snap-forge → snap-ship → snap-review
Need PR reviewed:       snap-review
PR got feedback:        snap-resolve → snap-ship
```

## Install

**All skills:**
```bash
npx skills add sadiksaifi/skills
```

**Individual skill:**
```bash
npx skills add sadiksaifi/skills --skill snap-forge
```

## License

MIT
