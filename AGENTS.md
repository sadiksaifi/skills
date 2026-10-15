# SNAP Skills Repository

Portable, self-contained [Agent Skills](https://agentskills.io/specification). User instructions override this file; this file overrides the specification.

## Skill shape

- `skill-name/SKILL.md`; add `scripts/` only for deterministic automation.
- `name`: 1-64 lowercase letters, numbers, and hyphens; matches the directory.
- `description`: one short line, `Use when the user asks to ...`; one trigger per distinct case.
- Body: one line telling the agent what to do, then pseudocode for the flow, then short bullets for rules.
- Pseudocode carries control flow. A line's comment carries that line's rules.
- Options are conditions in the flow ("only when asked"), not argument tables.
- Templates sit inline as fenced `markdown` blocks. Placeholders carry their own rules: length, and when to drop the section.
- Output a human reads (PR, issue, review comment) goes through `plain()`: everyday words, one short sentence per bullet, cut what the reader would not miss.
- End the flow with `done =` covering every item the skill touches.
- Keep each skill self-contained; duplicate a small rule instead of linking across skills.

## Writing

- State the target behavior; use a prohibition only as a guardrail.
- Cut every line the model already follows by default.
- Leave what the repo, a config file, or `--help` already says to those sources.
- Persist behavior in repository files, not conversation memory.

## Verify

After edits, check frontmatter, name and directory agreement, links, stale references, and `git diff --check`. Keep temporary files, generated output, and secrets out of git.
