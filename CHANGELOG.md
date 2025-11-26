# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-27

### Added
- Initial release of Grok CLI
- Interactive chat mode powered by Grok API
- Claude Code-inspired user experience and command structure
- Slash commands support:
  - `/help` - Show available commands
  - `/clear` - Clear conversation history
  - `/exit` - Exit the application
  - `/version` - Show version information
- Beautiful terminal UI with colors and formatting
- Conversation history tracking
- TypeScript-based implementation
- Comprehensive error handling
- Loading spinner for API requests
- Ctrl+C signal handling for graceful shutdown
- Environment variable support via .env file
- MIT License for open source distribution

### Features
- Direct interactive mode on startup (no arguments needed)
- Clean, minimalist opening message
- Real-time streaming responses from Grok API
- Command aliases for convenience (`/h`, `/c`, `/q`, `/v`)
- Helpful error messages with setup instructions
- Cross-platform support (Windows, macOS, Linux)

### Project Structure
- TypeScript source code in `src/` directory
- Compiled JavaScript output in `dist/` directory
- Modular architecture with separate Grok API client
- Comprehensive documentation in README.md
- Example environment configuration (.env.example)
- Proper .gitignore for Node.js projects

### Dependencies
- axios: HTTP client for Grok API requests
- chalk: Terminal styling and colors
- dotenv: Environment variable management
- ora: Loading spinner animations
- TypeScript: Type-safe development

### Documentation
- Comprehensive README.md with installation and usage instructions
- MIT License file
- Environment variable configuration example
- Command reference and examples

[1.0.0]: https://github.com/yourusername/grokcli/releases/tag/v1.0.0
