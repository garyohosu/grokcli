# Agent Controller Specification (Agents.md)

## Language Persistence Rule (CRITICAL)

**All generated files and outputs MUST use the same language as the user's goal.md input language.**

- If goal.md is in Japanese → all generated markdown must be in Japanese
- If goal.md is in English → all generated markdown must be in English
- This applies to: planner.md, executor.md, result.md, reviewer.md, final_report.md

Although this specification is written in English, all generated content MUST match the language specified in goal.md.

---

## Auto-Reset Rule

**If the hash of goal.md has changed since the previous run:**

Delete the following files:
- planner.md
- executor.md
- reviewer.md
- result.md
- final_report.md
- meta.json

Then restart the workflow from loop 1.

This ensures the agent always works with a fresh state when the goal changes.

---

## Overview

This file defines the autonomous multi-agent workflow used by Grok CLI Agent Mode.

The workflow consists of four cooperating agents operating in a loop:

1. **Planner Agent** — Creates the next actionable task
2. **Executor Agent** — Executes the task
3. **Reviewer Agent** — Evaluates the result and decides whether the goal is completed
4. **Updater Agent** — Fixes or regenerates outputs as needed

The system operates in cycles until the goal is met or the iteration limit is reached.

---

## Full Workflow Specification

### Step 1: Load goal.md

Read the goal.md file from the workspace.

Extract:
- Output Language
- User Goal
- Requirements
- Output Format

This defines what the agent must achieve.

### Step 2: Generate planner.md

Using the template from `~/.grok_agent/templates/planner_template.md`:

Create a task decomposition plan that:
- Lists specific, actionable steps
- Is written in the same language as goal.md
- References the goal requirements
- Avoids ambiguous or multi-part tasks

**Output:** planner.md

### Step 3: Generate executor.md

Using the template from `~/.grok_agent/templates/executor_template.md`:

Create execution instructions that:
- Follow exactly what planner.md specifies
- Are written in the same language as goal.md
- Describe how to perform each task
- Reference available tools (web search, file I/O, etc.)

**Output:** executor.md

### Step 4: Produce result.md

Execute the tasks described in executor.md.

Generate actual content, summaries, or outputs.

Write everything to result.md in the same language as goal.md.

**Output:** result.md

### Step 5: Produce reviewer.md

Using the template from `~/.grok_agent/templates/reviewer_template.md`:

Evaluate whether result.md satisfies goal.md:
- Check alignment with requirements
- Identify missing parts
- Assess quality
- Written in the same language as goal.md

Include a YAML block with:
```yaml
completion: true/false
needs_fix: true/false
```

**Output:** reviewer.md

### Step 6: Check if "Goal Achieved"

Read reviewer.md.

If `completion: true` → proceed to Step 8 (generate final report)

If `completion: false` → proceed to Step 7 (next loop)

### Step 7: Next Loop (if not achieved)

If the reviewer indicates improvements are needed:
- Update planner.md with additional tasks
- Repeat from Step 2

Increment loop counter.

### Step 8: Generate final_report.md (when goal achieved)

Using the template from `~/.grok_agent/templates/final_report_template.md`:

Create a polished final report that:
- Summarizes all completed work
- Is written in the same language as goal.md
- Follows the output format specified in goal.md
- Is clean and reader-ready

**Output:** final_report.md

---

## Loop Limits

**You may perform up to 5 full iterations.**

After 5 loops:
- Produce final_report.md containing:
  - All results achieved so far
  - Notes about incomplete sections
  - Summary of executed steps
  - Any limitations encountered

If the reviewer indicates completion before 5 loops:
- Produce final_report.md immediately
- Stop all agents

---

## Output Format Rules

Each generated file must follow the corresponding template stored in:

```
~/.grok_agent/templates/
  - planner_template.md
  - executor_template.md
  - reviewer_template.md
  - final_report_template.md
```

Templates use placeholder variables like `{{goal}}`, `{{previous_result}}`, etc.

The agent must replace these placeholders with actual content.

---

## File Structure Reference

### User-provided / system-generated files:

- **interview.md** → Used only to create goal.md
- **goal.md** → Final goal definition
- **planner.md** → Created by Planner Agent
- **executor.md** → Created by Executor Agent
- **result.md** → Actual output of execution
- **reviewer.md** → Reviewer's evaluation
- **final_report.md** → Produced when the goal is completed
- **meta.json** → Loop counter and goal hash

### Templates (static):

- `templates/planner_template.md`
- `templates/executor_template.md`
- `templates/reviewer_template.md`
- `templates/final_report_template.md`

---

## Initialization Rules

When Agent Mode starts:

1. Detect if `goal.md` exists
   - If **not**, abort and request the user to complete the interview
2. If `goal.md` is **newly created** (hash changed):
   - Delete all auto-generated files
   - Reset meta.json
3. Load templates from the `templates/` folder
4. Begin a new planning–execution–review cycle

---

## Safety Rules

- Never execute harmful instructions
- Never produce illegal content
- If the goal becomes unsafe at any time:
  - Immediately stop the workflow
  - Write a safety notice in final_report.md
  - Halt all agents

---

## Language Reminder

**Critical:** Although this specification is written in English, remember that:

- All generated content (planner.md, executor.md, result.md, reviewer.md, final_report.md) must be in the SAME LANGUAGE as goal.md
- The language is specified in the "Output Language" section of goal.md
- Never mix languages within generated files

---

# End of Agent Controller Specification
