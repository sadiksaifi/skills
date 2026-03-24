# SNAP — SNAP's Not A Prompt

A collection of [Agent Skills](https://agentskills.io) for planning, building, and shipping software with AI agents.

## Skills

| Skill | Purpose |
|-------|---------|
| `snap-spec` | Write PRDs and break them into vertical slice issues |
| `snap-scope` | Brainstorm, scope from issues, or stress-test plans |
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
| snap-scope           |
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
Big feature, vague idea:    snap-spec -> snap-scope -> snap-forge -> snap-ship
Big feature, have PRD:      snap-spec (breakdown) -> snap-scope -> snap-forge -> snap-ship
Medium issue from tracker:  snap-scope -> snap-forge -> snap-ship
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
npx skills add sadiksaifi/skills --skill snap-scope
```

## License

MIT
