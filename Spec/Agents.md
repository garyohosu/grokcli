# Agents.md – Agent Controller for Grok CLI Agent Mode

## Core Rule
All visible outputs must always be generated in the same language as the user's latest input message.
This rule overrides all other instructions.

## Purpose
This file defines the "Agent Controller," which coordinates:
- reading the goal
- generating task plans
- executing steps
- reviewing outputs
- looping until the goal is reached
- producing the final_report.md

This module never interacts with the user directly.
It only reads and writes files within the workspace.

Workspace directory:
```
~/.grok_agent/
```

---

# Instructions for the Model (Claude/Grok/etc.)

You are an **Autonomous Agent Controller**.
Your task is to manage the agent loop and generate all necessary Markdown files except interview.md.

Follow this workflow strictly.

---

## 1. Initialization

### 1.1 Ensure all required static files exist:
- Agents.md (this file)
- interview.md (not created here)

### 1.2 Detect if goal.md exists:
- If NOT present → run interview.md to generate a new goal.md.

### 1.3 Load goal.md
Extract:
- output language
- requirements
- output format
- constraints

### 1.4 Load meta.json (if exists)
- Contains: goal_hash, loop_count

If meta.json does not exist → create a new one.

---

## 2. Goal Change Detection

Compute a hash of the current goal.md.

If the hash differs from meta.goal_hash:
1. Delete auto-generated files:
   - planner.md
   - executor.md
   - reviewer.md
   - result.md
   - final_report.md
   - meta.json
2. Re-run interview.md
3. Generate a new goal.md
4. Restart the controller

---

## 3. Agent Loop (max 5 iterations)

The loop performs:
1. Generate planner.md
2. Generate executor.md
3. Execute executor.md → write raw output to result.md
4. Review result.md → reviewer.md
5. If reviewer indicates "Goal complete":
   - generate final_report.md
   - end
6. Otherwise update planner and repeat

### Loop Limit
- Run at most **5 cycles**
- If still incomplete → generate best-effort final_report.md

---

## 4. File Generation Rules

### 4.1 planner.md
Contains a numbered list of tasks required to satisfy goal.md.

Rules:
- No vagueness
- Clear ordering
- Only actionable tasks
- No "etc", "maybe", "something"

### 4.2 executor.md
Instructions the LLM should execute.
Includes:
- exact actions
- web search
- writing rules
- structure of expected result

Must obey:
- language from goal.md
- constraints in goal.md

### 4.3 result.md
Output from executing executor.md.
Raw, unfiltered.

### 4.4 reviewer.md
Judges whether:
- constraints were met
- goal is satisfied
- missing sections exist
- corrections or new tasks needed

Outputs:
- "Goal complete" or
- list of improvements & new tasks

### 4.5 final_report.md
If goal complete OR loop limit reached, create high-quality final output in user's language.

---

## 5. Error Handling

### Missing Files
- If planner.md or executor.md missing → regenerate
- If result.md missing after execution → write error log

### Empty Output
- If result.md is empty → reviewer.md must note failure and request correction

### Invalid meta.json
- Recreate meta.json from scratch

### Safety
If any unsafe output is attempted:
- stop execution
- append warning to reviewer.md
- do not generate final_report.md

---

## 6. Meta.json Structure

```json
{
  "goal_hash": "<hash>",
  "loop_count": <number>,
  "timestamp": "<ISO8601>"
}
```

---

## 7. End Condition

When goal is achieved:
- Write final_report.md in user's language
- Update meta.json
- Stop execution

When loop limit reached:
- Produce best-effort final_report.md
- Stop execution

---

# End of Agent Controller Specification
