# Agent Mode — Full Sequence Diagram Specification

This document describes the complete internal workflow of GrokCLI Agent Mode,
including the interactions between:

- The User
- GrokCLI (TypeScript layer)
- The AI Agent (Agents.md)
- The File System
- The `.grok_agent/` auto-generated workspace

```mermaid
sequenceDiagram
    autonumber

    participant User as User
    participant CLI as grokcli (TypeScript)
    participant Agent as AI Agent (Agents.md)
    participant FS as File System
    participant GA as .grok_agent/ Workspace

    User->>CLI: grokcli agents
    CLI->>FS: ensureAgentWorkspace()
    CLI->>FS: resetIfGoalChanged()
    FS-->>CLI: workspace ready

    alt goal.md missing
        CLI->>Agent: Request to generate initial goal (from interview.md)
        Agent-->>CLI: goal.md content
        CLI->>FS: write goal.md
    end

    loop Agent Loop (max 5)
        CLI->>Agent: Read goal.md and request planner.md
        Agent-->>CLI: planner.md content
        CLI->>GA: write planner.md

        CLI->>Agent: Provide planner.md and request executor.md
        Agent-->>CLI: executor.md content
        CLI->>GA: write executor.md

        CLI->>Agent: Execute tasks and request result.md
        Agent-->>CLI: result.md content
        CLI->>GA: write result.md

        CLI->>Agent: Provide result.md and request reviewer.md
        Agent-->>CLI: reviewer.md content
        CLI->>GA: write reviewer.md

        CLI->>Agent: Is the goal satisfied?
        Agent-->>CLI: Yes / No
    end

    alt Goal achieved
        CLI->>Agent: Request final_report.md
        Agent-->>CLI: final_report.md content
        CLI->>GA: write final_report.md
        CLI-->>User: Output final_report.md
    else Reached loop limit
        CLI-->>User: Return partial results with warning
    end
```

This diagram defines the authoritative behavior of GrokCLI Agent Mode.
