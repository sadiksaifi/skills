# SNAP Skills Repo

SNAP = SNAP's Not A Prompt. Repo holds self-contained agent units.

## Repo Rules

- Keep this file evergreen. No inventories of current units, paths, or named workflows.
- Put volatile detail near the unit it governs, not here.
- Local instructions nearest the change own the truth.
- Keep units self-contained. Small intentional duplication beats brittle cross-unit coupling.
- Write rules for future unknown units too, not only current repo shape.

## Writing Style

- Dense technical wording. Fewer tokens, more signal.
- Sacrifice grammar for precision.
- Heavy nouns over filler.
- Positive protocol: define right shape; skip anti-shape prose.
- Headings, label lines, bullets over paragraph mass.
- Wrap frontmatter at about 80 chars. Do not force 80-char wrapping elsewhere.

## Artifact Style

When an agent produces a durable artifact, apply same style inside the artifact:

- terse
- token-thin
- concrete
- implementation-aware
- handoff-ready

Default:
- technical nouns over narrative glue
- fields, ids, enums, interfaces over broad prose
- constraints, non-goals, out-of-scope only when they are task semantics

Avoid:
- broad adjectives
- motivational filler
- tutorial prose
- repeated caveats
- defensive prohibition lists unless safety-critical

## Editing Guidance

- Before editing any unit, read its local instructions, contracts, and templates.
- If a behavior should persist for future agents, encode it in the local unit instructions, not only in conversation.
- Keep repo-level guidance generic; push schemas, templates, and examples downward.
