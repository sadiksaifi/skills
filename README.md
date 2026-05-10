# SNAP — SNAP's Not A Prompt

Opinionated [Agent Skills](https://agentskills.io) for building software the way strong teams actually work: shape ideas, write PRDs, create issues, forge changes, open PRs, review, and resolve feedback.

## Skills

| Skill | Purpose |
|-------|---------|
| `snap-idea` | Relentlessly interview ideas, plans, and designs until shared understanding |
| `snap-prd` | Turn current context and repo understanding into an implementation-ready PRD GitHub issue |
| `snap-issues` | Turn conversation, PRD, or spec context into independently grabbable vertical GitHub issues |
| `snap-forge` | Strict TDD execution — red-green cycles, atomic commits, refactor at end |
| `snap-pr` | Create or update GitHub PRs from current branch work |
| `snap-review` | Read-only PR review — findings-first bugs, regressions, missing tests |
| `snap-resolve` | Resolve PR feedback — TDD fixes, reviewer replies, CI failures |

## Workflow

Use the skills independently or chain them when useful. Enter wherever your context is already clear.

```text
                    Any starting context
        (conversation / PRD / spec / GitHub issue)
                              |
        +---------------------+---------------------+
        |                     |                     |
  Unclear idea           Need a PRD          Need issues
        |                     |                     |
        v                     v                     v
   snap-idea ------------> snap-prd ----------> snap-issues
        |                     |                     |
        +---------------------+---------------------+
                              |
                         Ready issue
                              |
                              v
                         snap-forge
                         (TDD build)
                              |
                              v
                           snap-pr
                     (create/update PR)
                              |
                              v
                        snap-review
                              |
                         feedback?
                         /       \
                       no         yes
                       |           |
                       v           v
                     done    snap-resolve
                                   |
                                   v
                              snap-pr
                            (update PR)
                                   |
                                   +------ back to snap-review
```

Common paths:

```text
Idea to implementation: snap-idea → snap-prd → snap-issues → snap-forge → snap-pr
PRD/spec to issues:     snap-issues → snap-forge → snap-pr
Issue to PR:            snap-forge → snap-pr → snap-review
Feedback loop:          snap-review → snap-resolve → snap-pr → snap-review
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
