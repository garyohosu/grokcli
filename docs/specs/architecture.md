# Architecture Overview

The system consists of three main layers:

## 1. CLI Layer (TypeScript)

Handles:
- File I/O
- Hashing of goal.md
- Cleanup of generated files
- Process orchestration

## 2. Agent Layer (AI)

Implemented in Agents.md:
- Planning
- Execution prompt generation
- Reviewing results
- Producing the final report

## 3. Workspace Layer

.grok_agent/ contains:
- planner.md
- executor.md
- result.md
- reviewer.md
- final_report.md
- state.json
