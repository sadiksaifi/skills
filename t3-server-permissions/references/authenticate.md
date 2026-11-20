# Authenticate in System Settings

Use the user-authorized 1Password login for the matched Mac. The default item is `<target> macOS login` in Personal. Confirm its username matches the console account and the Remora endpoint matches that Mac's Tailscale peer.

Use the `remora` skill and its CLI help to select the password field and find the command that types from stdin. Verify focus in a fresh screenshot of the genuine macOS prompt. Pipe `op read --no-newline` directly to Remora's stdin. Keep the password in 1Password. Never capture it in the agent, a variable, a file, arguments, logs, or the clipboard. Verify masked input, submit once, and confirm macOS accepted it. Report a missing item or rejected password for that Mac.
