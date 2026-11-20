---
name: t3-server-permissions
description: Use when the user asks to restore or audit T3 Code server privacy grants on a remote Mac.
disable-model-invocation: true
---

Restore or audit the grants for the running T3 launcher on the requested Mac.

```text
target = match the user's host name or nickname in the `fleet` skill
if missing or ambiguous: ask which Mac
route, profile = Fleet SSH route and encrypted desktop profile for target
launcher = verify the running launcher from your machine over SSH
if the installed and loaded paths differ: report the pending switch and stop

read the `remora` skill for connection, input, screenshots, and session ownership
panes = Accessibility, Screen & System Audio Recording (upper list), App Management, Full Disk Access
if the user names grants: use that subset
for each pane:
    match the t3 row by exact path using Show in Finder and Get Info
    if audit or matching switch is on: record its state
    else if matching switch is off: turn it on
    else if + is available: add the verified executable
    else: retry the affected T3 operation and verify the executable macOS names
    if macOS asks for a password: follow Authenticate
    defer any quit-and-reopen prompt and verify the resulting switch in a fresh screenshot

if a restore changed a grant or macOS requested a relaunch, and the user didn't defer:
    warn of a brief disconnect and restart the service from your machine over SSH
    if the launcher path changed: repeat the pane checks once for the new path
    confirm the launcher is running and T3 Connect is reachable if configured

close via Remora's session cleanup rules
done = report the launcher, each grant, and any restart or unresolved check
```

- Verify the macOS host and console user over Fleet SSH. Read the running `program` from `launchctl print gui/<uid>/com.t3tools.t3code.service` and match it to `ProgramArguments[0]` in `~/Library/LaunchAgents/com.t3tools.t3code.service.plist`. Check `codesign --verify --strict`, identifier `t3`, and team `ARK85ZXQ4Z`.
- For Files & Folders or Automation, match the requested folder or app.
- Run `t3 service restart` as the console user with the verified launcher and the service's `T3CODE_HOME`. Use `t3 connect status` if Connect is configured.
- For a password prompt, read [Authenticate](references/authenticate.md).
