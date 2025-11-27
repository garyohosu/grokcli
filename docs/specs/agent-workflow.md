# Agent Workflow — Detailed Specification

This document defines each phase of the GrokCLI Agent Mode loop.

## 1. Requirements Gathering

- The agent reads interview.md.
- The agent asks the user for missing information.
- Collects constraints, preferences, and context.
- Ensures the inputs are sufficient to generate a well-defined goal.

## 2. Goal Generation (goal.md)

- The agent synthesizes user requirements into a clear, actionable goal.
- The file is created if missing.
- If modified by the user, TypeScript detects a hash mismatch and resets all generated files.

## 3. Planning (planner.md)

- The agent performs task decomposition.
- Creates a structured list: Task 1, Task 2, …
- Ensures tasks are achievable through executor instructions.

## 4. Execution (executor.md)

Defines how to execute each task.

GrokCLI performs:
- Web search
- File reads/writes
- Summaries
- Document generation

Output is written to result.md.

## 5. Review (reviewer.md)

- Checks whether result.md satisfies the goal.
- Identifies missing elements.
- If improvements are needed:
  - Adds new tasks to planner.md.
- If all requirements are met:
  - Signals completion.

## 6. Final Report (final_report.md)

- Generated only when the reviewer confirms success.
- Combines all results into a polished final document.

## 7. Looping Behavior

- The cycle repeats up to 5 iterations.
- Early termination occurs when:
  - Reviewer marks goal as satisfied.

## 8. Goal Change Reset

If goal.md changes:
- TypeScript deletes:
  - planner.md
  - executor.md
  - result.md
  - reviewer.md
  - final_report.md
  - state.json
- A fresh loop starts.

This ensures deterministic behavior.
