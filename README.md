# SNAP — SNAP's Not A Prompt

Opinionated [Agent Skills](https://agentskills.io) for building software the way strong teams actually work: shape ideas, create issues, forge changes, open PRs, review, and resolve feedback.

## Skills

| Skill | Purpose |
|-------|---------|
| `snap-idea` | Relentlessly interview ideas, plans, and designs until shared understanding |
| `snap-issues` | Turn context into one concise GitHub issue or a dependency-aware set of vertical issues |
| `snap-forge` | Implement ready work through vertical red-green cycles and atomic commits |
| `snap-pr` | Publish or refresh a reviewer-ready PR from current branch work |
| `snap-review` | Read-only PR review — priority-labeled findings, risks, missing tests; optional `auto` posting only for findings or material missing tests |
| `snap-resolve` | Resolve PR feedback and CI failures automatically; optional `ask` approval gate |
| `snap-visual` | Turn an explanation into a single self-contained HTML visual brief and open it in the browser |
| `snap-handoff` | Compact the current session into a handoff document for a fresh agent |

## Workflow

Use the skills independently or chain them when useful. Enter wherever your context is already clear.

```text
                    Any starting context
        (conversation / plan / spec / GitHub issue)
                              |
                 +------------+------------+
                 |                         |
             unclear                     clear
                 |                         |
                 v                         |
             snap-idea                     |
                 |                         |
                 +------------+------------+
                              |
                              v
                        snap-issues
                    (one issue or a set)
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
Idea to implementation: snap-idea → snap-issues → snap-forge → snap-pr
Plan/spec to issues:    snap-issues → snap-forge → snap-pr
Issue to PR:            snap-forge → snap-pr → snap-review
Feedback loop:          snap-review → snap-resolve → snap-pr → snap-review
Session transfer:       snap-handoff
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
