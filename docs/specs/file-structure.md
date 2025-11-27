# File Structure Specification

This document lists all files used by Agent Mode.

## User-facing files (editable)

- goal.md
- interview.md
- Agents.md

These files define the agent's behavior and user intent.

## Auto-generated files (non-editable)

Located in .grok_agent/:

- planner.md
- executor.md
- result.md
- reviewer.md
- final_report.md
- state.json

These files are created and overwritten automatically.

## Reset Rule

If goal.md changes:
- All auto-generated files are deleted by TypeScript.
- A clean cycle begins.
