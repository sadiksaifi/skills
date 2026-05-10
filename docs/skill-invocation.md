# Skill Invocation Convention

Portable argument syntax for `SKILL.md` bodies. Do not use harness-specific argument frontmatter.

## Syntax

```text
/skill:<name> [key|key=value]...
```

If a harness omits `/skill:<name>`, parse the provided invocation text with the same rules.

## Parse

- Split shell-style; quotes preserve spaces.
- `key` => `key=true`.
- `key=value` => scalar value.
- `key="multi word"` => string value.
- `key=[a,b,c]` => list value.
- `key=["a.ts","b.ts"]` => string list.
- Array literals must contain no whitespace outside quoted strings.
- Boolean literals `true` / `false` coerce to booleans.
- Other scalar values stay strings unless the skill declares coercion.
- Duplicate key: later wins unless the key is declared repeatable.
- Missing required/conflicting route keys: stop and print concise usage help.
- Unknown args: ignore only if harmless; otherwise stop and print concise usage help.

## Reserved Key

- `help` is reserved.
- `help=true` stops workflow execution.
- Missing required args, conflicting routes, and unsafe unknown args also stop workflow execution.
- Generate concise help from `description`, `## Invocation`, `## Args`, `## Routes`, and local examples.
- Include purpose, syntax, keys, route selectors, required args, defaults, and examples.
- Do not duplicate a static help document.

## Skill Body Contract

Use `SKILL.md` as a thin router. Move route-specific procedure to referenced files when it exceeds ~30 lines or has distinct templates/gotchas.

```md
## Invocation

Syntax: `/skill:<name> [key|key=value]...`

Parse:
- shell-style split; quotes preserve spaces
- `key` => `key=true`
- `key=value` => scalar
- `key=[a,b]` => list; no whitespace outside quoted strings
- `help` => print usage; do not execute
- missing required/conflict/unsafe unknown => print usage; do not execute

## Args

| Key | Values | Default | Notes |
| --- | --- | --- | --- |
| `help` | bool | false | reserved; show usage |
| `create` | bool | false | route selector |
| `topic` | text | — | required for `create` |
| `file` | list | [] | optional inputs |

## Routes

| Selector | Requires | Load |
| --- | --- | --- |
| `create` | `topic` | `references/create.md` |
| default | — | inline default workflow or ask |
```

Route reference files own execution steps, templates, examples, and route-local gotchas. `SKILL.md` owns parse rules, args, route selection, help behavior, and resource map.

## Examples

```text
/skill:snap-idea topic="agent skill arguments" deep
```

```json
{"topic":"agent skill arguments","deep":true}
```

```text
/skill:snap-pr create issue=123 labels=["bug","p0"] draft=false
```

```json
{"create":true,"issue":"123","labels":["bug","p0"],"draft":false}
```

```text
/skill:snap-pr help
```

```json
{"help":true}
```
