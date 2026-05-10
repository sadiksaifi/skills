# PRD Template

Use the Markdown inside `<template>` as the GitHub issue body.

<template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A long, numbered list of user stories. Each user story should be in the format:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending.
</user-story-example>

This list should be extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built or modified
- The interfaces of those modules
- Technical clarifications from the user
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do not include specific file paths or code snippets. They may become outdated.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can, inline only the decision-rich part and note that it came from a prototype.

## Testing Decisions

A list of testing decisions that were made. Include:

- What external behavior should be tested
- Which modules should be tested
- Prior art for tests in the codebase

## Out of Scope

Things intentionally excluded from this PRD.

## Further Notes

Anything important that does not fit elsewhere.

</template>
