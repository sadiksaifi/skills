# SNAP — SNAP's Not A Prompt

SNAP is a set of opinionated [Agent Skills](https://agentskills.io) for building software the way strong teams actually work: spec it, scope it, test it, ship it, and handle feedback.

## Skills

| Skill | Purpose |
|-------|---------|
| `snap-spec` | Write PRDs and break them into vertical slice issues |
| `snap-grill-me` | Interview relentlessly about a plan until every branch is resolved |
| `snap-forge` | TDD plan + execute RED-GREEN-REFACTOR cycles |
| `snap-ship` | Create and update GitHub pull requests |
| `snap-resolve` | Resolve PR feedback with TDD fixes |

## Workflow

```
+-------------+
| You have an |
| idea        |
+-------------+
       |
       +----------------+----------------+
       |                |                |
       v                v                v
  Need a PRD?      Have issue?       Small fix?
       |                |                |
      yes               |                |
       v                |                |
+--------------+        |                |
| snap-spec    |        |                |
| interview    |        |                |
| draft PRD    |        |                |
| publish      |        |                |
| split?       |        |                |
| yes -> issues|        |                |
+------+-------+        |                |
       |                |                |
       +----------------v----------------+
                        |
                        v
+----------------------+
| snap-grill-me           |
| parse issue or idea  |
| explore code         |
| brainstorm           |
| stress-test          |
+----------+-----------+
           |
           v
+----------------------+
| snap-forge           |
| plan -> RED -> GREEN |
| REFACTOR -> VERIFY   |
| -> COMMIT (repeat)   |
+----------+-----------+
           |
           v
+----------------------+
| snap-ship            |
| analyze diff         |
| create/update PR     |
+----------+-----------+
           |
       feedback?
           |
           v
+----------------------+
| snap-resolve         |
| fetch -> categorize  |
| TDD fix -> push      |
| reply                |
+----------+-----------+
           |
           v
    back to snap-ship
   (update PR description)
```

**Enter the pipeline wherever your clarity starts:**

```
Big feature, vague idea:    snap-spec -> snap-grill-me -> snap-forge -> snap-ship
Big feature, have PRD:      snap-spec (breakdown) -> snap-grill-me -> snap-forge -> snap-ship
Medium issue from tracker:  snap-grill-me -> snap-forge -> snap-ship
Small fix, know what to do: snap-forge -> snap-ship
PR got feedback:            snap-resolve -> snap-ship
```

## Install

**All skills:**
```bash
npx skills add sadiksaifi/skills
```

**Individual skill:**
```bash
npx skills add sadiksaifi/skills --skill snap-grill-me
```

## License

MIT
