# Grok CLI

A command-line interface tool powered by the Grok API, providing an AI assistant directly in your terminal.

## Features

- 🤖 Interactive chat mode with Grok AI
- 💬 Single-question mode for quick queries
- 🎨 Beautiful terminal UI with colors
- 📝 Conversation history support
- ⚡ Fast and lightweight
- 🛠️ Function calling support - Grok can execute shell commands when needed
- 🖥️ Cross-platform command execution (Windows/Linux/macOS)

## Installation

### From Source

```bash
# Clone the repository
git clone <repository-url>
cd grokcli

# Install dependencies
npm install

# Build the project
npm run build

# Link the CLI globally (optional)
npm link
```

### From npm (Coming Soon)

```bash
npm install -g grokcli
```

## Setup

### 🔧 Configuration (API Keys)

Grok CLI loads configuration from a global config directory:

**macOS / Linux:**
```
~/.grokcli/.env
```

**Windows (PowerShell):**
```
$env:USERPROFILE\.grokcli\.env
```

This global config location allows grokcli to run from any directory without needing a local .env file.

### Setup Steps

1. Get your Grok API key from [X.AI](https://x.ai)

2. Create the global config directory and file:

**macOS / Linux:**
```bash
mkdir -p ~/.grokcli
nano ~/.grokcli/.env
```

**Windows (PowerShell):**
```powershell
mkdir $env:USERPROFILE\.grokcli
notepad $env:USERPROFILE\.grokcli\.env
```

3. Add your API keys to the `.env` file:

```bash
GROK_API_KEY=your_api_key_here
SERPAPI_KEY=your_serpapi_key_here
```

**Alternative:** You can also create a `.env` file in the project directory as a fallback, but the global config is recommended for convenience.

## Usage

### Default Mode: Agent Mode

Run Grok CLI to start Agent Mode (autonomous multi-step task execution):

```bash
grokcli
```

If you don't have a goal defined, the CLI will start an interactive interview to create one. If a goal already exists, the agent workflow begins automatically.

### Interactive Chat Mode

For traditional back-and-forth conversation with Grok:

```bash
grokcli chat
```

Type your questions and get responses in real-time. Type `exit` or `quit` to end the session.

### Available Commands

Inside the interactive mode, you can use these commands:

- `/help` - Show available commands
- `/clear` - Clear conversation history
- `/exit` - Exit the application
- `/version` - Show version information
- `/model [name|list]` - View or switch the active model
- `/search <query>` - Search the web using SerpAPI
- `/exec <command>` - Execute shell command directly



### Reset Workspace

Reset the Agent Mode workspace and start fresh:

```bash
grokcli --reset
```

This deletes all generated files and starts a new interview.

### Function Calling (AI-Powered Command Execution)

Grok CLI now supports function calling! When you ask Grok to perform system-related tasks, it can automatically execute shell commands:

```bash
> List all files in the current directory

# Grok will automatically execute the appropriate command:
# - Windows: dir
# - Linux/macOS: ls -la
```

The AI automatically detects your operating system and uses the correct commands. You can ask Grok to:

- Check system information
- List files and directories
- View file contents
- Run development commands (npm, git, etc.)
- And much more!

**Note:** Shell commands are executed with the same permissions as your terminal session. Be cautious when allowing command execution.

---

## 🤖 Agent Mode (Experimental)

### Overview

**Agent Mode** enables Grok CLI to automatically plan, execute, and refine multi-step tasks using an autonomous loop driven by templates and LLM reasoning. Unlike normal chat mode where you interact back-and-forth, Agent Mode works independently to achieve a defined goal through iterative planning, execution, and review cycles.

**Key Capabilities:**
- Autonomous multi-step task execution
- Self-planning and task decomposition
- Automatic quality review and refinement
- Iterative improvement loop (up to 5 cycles)
- Language-aware output (matches user input language)

### How Agent Mode Works

Agent Mode follows this workflow:

```
User → Interview → goal.md → Planner → Executor → Reviewer → Final Report
                       ↓         ↓         ↓          ↓
                    Loop until goal achieved or max iterations reached
```

**Workflow Steps:**

1. **Interview Mode** (if no goal exists): Interactive questions to define your goal
2. **goal.md**: Your objective, requirements, and success criteria
3. **planner.md**: Task decomposition and execution plan
4. **executor.md**: Detailed execution instructions
5. **result.md**: Raw output from task execution
6. **reviewer.md**: Quality assessment and improvement suggestions
7. **final_report.md**: Polished final deliverable

**Architecture:**

Each file plays a specific role:

| File | Purpose | Auto-Generated |
|------|---------|----------------|
| `goal.md` | User-defined or interview-generated goal | ✓ (via interview) |
| `planner.md` | Task decomposition and planning | ✓ |
| `executor.md` | Execution instructions | ✓ |
| `result.md` | Raw task output | ✓ |
| `reviewer.md` | Quality check and feedback | ✓ |
| `final_report.md` | Final formatted answer | ✓ |
| `meta.json` | Loop counter & goal hash tracking | ✓ |
| `Agents.md` | Agent controller specification | Static |
| `interview.md` | Interactive goal definition prompt | Static |

**Important Rules:**
- **Language Persistence**: All output matches the user's input language
- **Loop Limit**: Maximum 5 iterations to prevent infinite loops
- **Auto-Reset**: When `goal.md` changes, all generated files are automatically deleted
- **Isolated Workspace**: All files stored in `~/.grok_agent/`

### Folder Structure

Agent Mode uses an isolated workspace directory:

```
~/.grok_agent/
├── Agents.md              # Agent controller (static)
├── interview.md           # Interactive prompt maker (static)
├── goal.md                # User goal definition
├── planner.md             # Task plan (auto-generated)
├── executor.md            # Execution prompt (auto-generated)
├── result.md              # Task output (auto-generated)
├── reviewer.md            # Quality review (auto-generated)
├── final_report.md        # Final deliverable (auto-generated)
├── meta.json              # Metadata (auto-generated)
└── templates/             # Agent templates
    ├── planner_template.md
    ├── executor_template.md
    ├── reviewer_template.md
    └── final_report_template.md
```

### How to Define a Goal

#### Method A: Automatic (Recommended)

Run Grok CLI without a goal - the interview will start automatically:

```bash
grokcli
```

The CLI will ask you questions to build a complete goal definition:
- What do you want to achieve?
- What format should the output be?
- What are the requirements and constraints?

Example interaction:
```
What would you like the AI agent to achieve?
> Create a marketing plan for a new coffee shop

Generating goal.md...
✓ goal.md created successfully
Starting agent workflow...
```

#### Method B: Manual

Create `~/.grok_agent/goal.md` manually:

```markdown
# Goal Definition

## Output Language
English

## User Goal
Create a comprehensive marketing plan for a new coffee shop in downtown Seattle,
targeting young professionals and students.

## Requirements
- Include social media strategy
- Budget recommendations
- Timeline for first 3 months
- Competitor analysis

## Output Format
A structured markdown document with sections for each marketing channel
```

### How to Run Agent Mode

#### Start Agent Workflow

```bash
grokcli
```

**Behavior:**
- If `goal.md` doesn't exist → starts interview mode
- If `goal.md` exists → runs agent workflow immediately
- Progress is logged to console
- Final report path is displayed when complete

#### Reset Workspace

```bash
grokcli --reset
```

**This command:**
- Deletes the entire `~/.grok_agent/` directory
- Re-creates empty workspace
- Starts fresh interview mode

**Use reset when:**
- You want to start a completely new goal
- Previous run had errors
- You want to clear all generated files

#### Chat Mode with Reset

```bash
grokcli chat --reset
```

This resets the workspace and then enters interactive chat mode.

### Workflow Example

**Starting Agent Mode:**

```bash
$ grokcli

╔══════════════════════════════════════════════════════════════╗
║ Grok CLI - Agent Mode                                        ║
╚══════════════════════════════════════════════════════════════╝

Initializing workspace...
✓ Workspace loaded (~/.grok_agent/)

goal.md not found
Starting interview mode to create your goal...

Interview Mode:
Please describe what you would like the AI agent to achieve.

What would you like the AI agent to achieve?
> Write a technical blog post about TypeScript generics

Generating goal.md...
✓ goal.md created successfully

Starting agent workflow...

=== Loop 1/5 ===

Running Planner Agent...
Running Executor Agent...
Generating result...
Running Reviewer Agent...
Goal not yet achieved. Continuing to next iteration...

=== Loop 2/5 ===

Running Planner Agent...
Running Executor Agent...
Generating result...
Running Reviewer Agent...

✓ Goal achieved!

Generating final report...

✓ Agent workflow completed successfully!
Completed in 2 loop(s)

Final report available at:
/Users/you/.grok_agent/final_report.md
```

**Sample Generated Files:**

**goal.md:**
```markdown
# Goal Definition

## Output Language
English

## User Goal
Write a comprehensive technical blog post about TypeScript generics...

## Requirements
- Explain basic to advanced concepts
- Include code examples
- Target intermediate developers
...
```

**planner.md (Loop 1):**
```markdown
# Planning Instructions

## Step Plan
Task 1: Research and outline TypeScript generics concepts
Task 2: Write introduction and basic examples
Task 3: Add advanced use cases
```

**final_report.md:**
```markdown
# TypeScript Generics: A Comprehensive Guide

Generics are one of TypeScript's most powerful features...
[Complete polished blog post]
```

### Safety Notes

⚠️ **Important Security Considerations:**

- **No Harmful Content**: Agent Mode will not generate illegal, harmful, or unsafe content
- **LLM Safety**: Agents inherit Grok API's safety mechanisms
- **Data Privacy**: Workspace files may contain your goals and generated content
  - Avoid including sensitive personal information
  - The workspace is local to your machine
  - No data is shared beyond Grok API calls
- **Command Execution**: Agents use the same function calling features as chat mode
  - Be aware that tasks might involve shell commands
  - Review generated scripts before manual execution

### Limitations

**Current Limitations:**

- **Accuracy Not Guaranteed**: AI-generated plans and outputs may contain errors
- **5-Cycle Limit**: Complex tasks may not complete within the iteration limit
- **API Key Required**: Requires valid `GROK_API_KEY` in configuration
- **Sequential Execution**: Tasks run one at a time, not in parallel
- **Workspace Access**: Requires write permissions to `~/.grok_agent/`
- **No Incremental Updates**: Re-running with same goal starts from scratch
- **Template-Dependent**: Quality depends on template design and LLM reasoning
- **Experimental Status**: This feature is under active development

**Known Issues:**

- Very complex goals may require multiple runs
- Goal hash detection might not catch all semantic changes
- Some tasks may benefit from manual goal.md editing

### Troubleshooting

**"goal.md not found" keeps appearing:**
- Run `grokcli` to start interview mode
- Or manually create `~/.grok_agent/goal.md`

**Agent workflow stops early:**
- Check if reviewer marked goal as achieved
- Review `reviewer.md` for feedback
- Consider breaking goal into smaller tasks

**Generated files have errors:**
- Try `grokcli --reset` to start fresh
- Edit `goal.md` to be more specific
- Check that templates loaded correctly

---

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Run the built version
npm start
```

## Project Structure

```
grokcli/
├── src/
│   ├── index.ts          # Main CLI entry point
│   └── grok-client.ts    # Grok API client
├── dist/                 # Compiled JavaScript
├── .env                  # Environment variables (create this)
├── .gitignore
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

## API

The tool uses the [Grok API](https://docs.x.ai/api) from X.AI. Make sure you have access to the API and a valid API key.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by [Grok API](https://x.ai)
- Inspired by other AI CLI tools like Gemini and Claude Code

## Support

If you encounter any issues or have questions, please [open an issue](../../issues) on GitHub.

---

## ⚠️ Experimental Features

**Agent Mode is experimental.** Use at your own risk.

This feature is under active development and may undergo significant changes. While we strive for reliability and safety, autonomous agent workflows can produce unexpected results. Always review generated content before using it in production environments.
