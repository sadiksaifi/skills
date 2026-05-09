# SNAP — SNAP's Not A Prompt

Opinionated [Agent Skills](https://agentskills.io) for building software the way strong teams actually work: scope it, spec it, slice it, forge it, PR it, review it, resolve it.

## Skills

| Skill | Purpose |
|-------|---------|
| `snap-scope` | Relentless design interview — stress-test plans and architectures |
| `snap-prd` | Write PRDs from scoped context + codebase exploration → GitHub issue |
| `snap-slice` | Break a PRD into vertical slice issues with FR/NFR coverage mapping |
| `snap-forge` | Strict TDD execution — RED-GREEN-VERIFY-COMMIT, refactor at end |
| `snap-pr` | Create GitHub PRs from current branch commits; update with `--update` |
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
        +----+       |            |
        |    |       |            |
        |    v       |            |
        | snap-slice |            |
        |  (issues)  |            |
        |    |       |            |
        +----+-------+------------+
                     |
                     v
                snap-forge
          (from PRD, slice, or issue)
                     |
                     v
                 snap-pr
             (create/update PR)
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
               back to snap-pr
              (update PR body)
```

**Enter wherever your clarity starts:**

```
Vague idea:             snap-scope → snap-prd → snap-slice → snap-forge → snap-pr → snap-review
Have PRD, ready:        snap-forge → snap-pr → snap-review
Have PRD, need slices:  snap-slice → snap-forge → snap-pr → snap-review
Have issue, ready:      snap-forge → snap-pr → snap-review
Need PR reviewed:       snap-review
PR got feedback:        snap-resolve → snap-pr
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
