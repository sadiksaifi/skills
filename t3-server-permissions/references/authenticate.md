# Authenticate in System Settings

Use the user-authorized 1Password login for the matched Mac. The default item is `<target> macOS login` in Personal. Confirm its username matches the console account and the Remora endpoint matches that Mac's Tailscale peer.

Use the `remora` skill and its CLI help to select the password field and find the command that types from stdin. Verify focus in a fresh screenshot of the genuine macOS prompt. Read the password with `op read --no-newline`; validate a nonempty single line in process memory and send it directly to Remora on stdin. Keep it out of arguments, logs, and the clipboard. Verify masked input, submit once, and confirm macOS accepted it. Report a missing item or rejected password for that Mac.
