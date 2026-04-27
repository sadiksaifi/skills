# Snap Review PR Comment Template

Use for GitHub PR review body/comment after user approval.

## Body

```markdown
Findings

[ordered findings, or `No Findings`]

Missing Tests

[material coverage gaps, or `None`]

Risks / Unknowns

[merge risks, validation notes, inaccessible/conflicting context, or `None`]

*Reviewed by [agent-name](agent-url) using [skill:snap-review](skill-url)*
```

## Attribution

Harness identity is self-detected by the running agent/harness. Do not ask user.
Prefer known harness URL when identity is clear:

- Pi: `[pi](https://pi.dev)`
- Claude Code: `[Claude Code](https://code.claude.com/docs/en/quickstart)`
- Codex: `[Codex](https://developers.openai.com/codex/cli)`
- OpenCode: `[OpenCode](https://opencode.ai)`

Skill URL:

- `[skill:snap-review](https://github.com/sadiksaifi/skills/blob/refactor/skills/snap-review/SKILL.md)`

## Posting

- Ask user before posting: `Post this review to the PR?`
- If yes, post as a GitHub PR review/comment body.
- Preserve the exact reviewed findings. Do not add new findings while posting.
- Append attribution as final line.
- Capture the new review/comment `html_url` in the posting call or query it immediately after posting.
- Final chat response after a successful post: `Posted review: <review/comment URL>`.
- Do not report posting complete without the link unless GitHub API retrieval fails.
