# Refactor Candidates

After ALL behaviors green, single refactor pass. Never refactor while RED or mid-cycle — patterns only emerge once enough implementation exists.

- **Duplication** → Extract function/class
- **Long methods** → Break into private helpers (keep tests on public interface)
- **Shallow modules** → Combine or deepen (see deep-modules.md)
- **Feature envy** → Move logic to where data lives
- **Primitive obsession** → Introduce value objects
- **SOLID violations** → Apply where natural, don't force
- **Existing code** the new code reveals as problematic

Run tests after each refactor step. If anything breaks, undo and try a smaller step.
