# Issue Template

Use the Markdown inside `<template>` as the GitHub issue body.
Omit `## Source` when there is no source GitHub issue. Include `Breakdown` when a breakdown comment exists.

<template>

## Source

Read the source issue before implementation, including all comments. Follow linked issues, specs, PRDs, and comments recursively when they affect this work.

- `Issue:` [source GitHub issue URL]
- `Breakdown:` [breakdown comment URL, if one exists]

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation.

Include the public behavior and relevant API, UI, data, or job contract needed to implement this slice without rediscovering the intended behavior.

Avoid specific file paths or code snippets. They may end up being outdated very quickly. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can, inline it here and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Acceptance criteria

A checklist of externally verifiable outcomes for this slice.

- [ ] [specific user-visible or API-visible behavior]
- [ ] [error, empty, loading, permission, or edge behavior if relevant]
- [ ] [integration behavior across the touched layers]

## Testing

Describe the tests needed for this slice. Prefer tests of public behavior over implementation details.

- [test module or surface]
- [prior art test file or pattern if useful]
- [manual verification only if automated coverage is not practical]

## Blocked by

A reference to the blocking issue (if any)

- [GitHub issue ref] — [why it blocks this slice]

Or `None - can start immediately` if no blockers.

## Type

`AFK` or `HITL`

- `AFK:` can be implemented and merged without human interaction
- `HITL:` requires human interaction, such as an architectural decision or design review

</template>
