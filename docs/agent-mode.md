# Agent Mode Overview

Agent Mode enables GrokCLI to operate as a multi-step autonomous AI agent.

The workflow includes:

- Gathering user requirements
- Generating goal.md
- Creating a task plan (planner.md)
- Executing tasks (executor.md)
- Reviewing results (reviewer.md)
- Producing a final report (final_report.md)

All generated files are stored inside `.grok_agent/` and are automatically deleted when the goal changes.
