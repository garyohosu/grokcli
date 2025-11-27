# Architecture — GrokCLI Agent Mode

This document describes the layered architecture used by GrokCLI.

## Layer 1 — CLI Layer (TypeScript)

**Responsibilities:**
- File I/O
- Read/write .grok_agent/ files
- Hash computation for goal.md
- Resetting generated files when the goal changes
- Orchestration of planner/executor/reviewer steps
- Interaction with the Grok API

**Files involved:**
- src/agent/runner.ts
- src/agent/reset.ts
- src/utils/hash.ts

## Layer 2 — Agent Layer (AI)

**Responsibilities:**
- Defines behavior in Agents.md
- Generates:
  - planner.md
  - executor.md
  - result.md
  - reviewer.md
  - final_report.md

**Rules:**
- Must always output in the user's language
- Must follow the task loop
- Must regenerate files when reset

## Layer 3 — Workspace Layer (.grok_agent/)

**Generated files:**
- planner.md
- executor.md
- result.md
- reviewer.md
- final_report.md
- state.json

**Rules:**
- Should not be edited manually
- Should not be committed to Git
- Should always reflect current goal.md
