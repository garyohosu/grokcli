# Grok CLI

A command-line interface tool powered by the Grok API, providing an AI assistant directly in your terminal.

## Features

- 🤖 Interactive chat mode with Grok AI
- 💬 Single-question mode for quick queries
- 🎨 Beautiful terminal UI with colors
- 📝 Conversation history support
- ⚡ Fast and lightweight

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

1. Get your Grok API key from [X.AI](https://x.ai)

2. Create a `.env` file in the project root:

```bash
GROK_API_KEY=your_api_key_here
```

Or set the environment variable:

```bash
export GROK_API_KEY=your_api_key_here
```

## Usage

### Interactive Chat Mode

Start an interactive conversation with Grok:

```bash
grokcli
# or
grokcli chat
```

Type your questions and get responses in real-time. Type `exit` or `quit` to end the session.

### Single Question Mode

Ask a single question:

```bash
grokcli "What is the meaning of life?"
```

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
