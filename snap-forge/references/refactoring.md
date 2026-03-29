# Refactor Candidates

After each GREEN, look for these opportunities. Never refactor while RED — get to GREEN first, then improve.

- **Duplication** → Extract function/class
- **Long methods** → Break into private helpers (keep tests on public interface)
- **Shallow modules** → Combine or deepen (see deep-modules.md)
- **Feature envy** → Move logic to where data lives
- **Primitive obsession** → Introduce value objects
- **SOLID violations** → Apply where natural, don't force
- **Existing code** the new code reveals as problematic

Run tests after each refactor step. If anything breaks, undo and try a smaller step.
