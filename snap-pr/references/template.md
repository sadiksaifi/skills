# PR Template

Use the Markdown inside `<template>` as the fallback PR body.
Always include `## QA`, even when the repo PR template does not have one.
Omit `## Closes` when no closing issue refs are known.
Write `## Changes` as grouped review notes, not a commit log. Do not include commit subjects, hashes, or commit counts unless the user explicitly asks.

<qa-guidance>
Write QA as a manual reviewer walkthrough, not a test transcript.

Good QA:
- Open the settings page, turn email notifications off, save, then refresh. The toggle should stay off and no confirmation email should be sent.

Bad QA:
- Run `pnpm test`.
- Verify `expect(response.status).toBe(200)`.
- Check that `POST /api/settings` returns `{ "ok": true }`.
</qa-guidance>

<template>

## Summary

- [brief outcome-focused summary]

## Changes

- [behavior or subsystem change]

## Test Plan

- [automated verification performed]

## QA

- [manual reviewer scenario: start here, do this, expect this result]

## Closes

- [issue refs]

</template>
