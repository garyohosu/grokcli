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

### Interactive Chat Mode

Start an interactive conversation with Grok:

```bash
grokcli
# or
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



### Single Question Mode

Ask a single question:

```bash
grokcli "What is the meaning of life?"
```

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
