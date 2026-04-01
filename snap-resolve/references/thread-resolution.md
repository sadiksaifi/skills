# Thread Resolution via GraphQL

Every addressed thread gets resolved. Not optional.

## Fetch thread node IDs

Run during Step 1. **Store node IDs** for Step 7 resolution.

```bash
gh api graphql -f query='
  query($owner: String!, $repo: String!, $pr: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $pr) {
        reviewThreads(first: 100) {
          nodes {
            id
            isResolved
            path
            comments(first: 1) {
              nodes { body author { login } }
            }
          }
        }
      }
    }
  }
' -f owner='{owner}' -f repo='{repo}' -F pr='{number}'
```

Filter `isResolved: true`. Retain `id` for every unresolved thread.

## Resolve each thread

One mutation per thread, after replies posted:

```bash
gh api graphql -f query='
  mutation($threadId: ID!) {
    resolveReviewThread(input: { threadId: $threadId }) {
      thread { id isResolved }
    }
  }
' -f threadId='{thread_node_id}'
```

## Rules

- **[FIX]** — replied + committed → resolve
- **[EXPLAIN]** — replied → resolve
- **Uncategorized / skipped** — do NOT resolve
- **Already resolved** — skip

## Verify

Re-query after mutations:

```bash
gh api graphql -f query='
  query($owner: String!, $repo: String!, $pr: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $pr) {
        reviewThreads(first: 100, filterBy: {resolved: false}) {
          totalCount
          nodes { id path }
        }
      }
    }
  }
' -f owner='{owner}' -f repo='{repo}' -F pr='{number}'
```

Only uncategorized threads should remain. Unexpected open threads = missed reply.

## Permissions

If `resolveReviewThread` fails on a thread (permissions), log and continue.
Don't fail the step.
