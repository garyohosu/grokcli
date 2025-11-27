# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Claude.md - Workflow instructions for Claude Code integration
- Agents.md - Instructions for AI agents working on this project
- Automated workflow for reading CHANGELOG.md on startup and updating it after work completion
- **Global configuration directory** - Load .env from `~/.grokcli/.env` (macOS/Linux) or `%USERPROFILE%\.grokcli\.env` (Windows)
- Config loading utility module (src/config.ts) with fallback to local .env
- Cross-platform global config support allowing grokcli to run from any directory
- Added /version command to opening message command list
- Added /exec command for executing shell commands directly from Grok CLI
- Command execution functionality with proper error handling and output display
- **Function calling support** - Grok AI can now execute shell commands automatically when needed
- OS detection utility to distinguish between Windows, Linux, and macOS
- Cross-platform shell command execution with OS-specific command handling
- Tool definitions for shell command execution with proper parameter validation
- Iterative tool call handling with conversation context preservation
- **Model management system** - View and change AI models dynamically
- `/model` command to display current model
- `/model <name>` command to change to a different model
- `/model list` command to list all available models with aliases
- Support for 11 different Grok models including Grok 4.1, Grok 4, Grok 3, and specialized models
- Model alias system for convenient model switching (e.g., 'fast', '4', 'mini', 'code', 'vision')
- Dynamic model switching without restarting the CLI
- Model validation with helpful error messages
- **SerpAPI web search integration** - Search the web from CLI and via function calling
- `/search <query>` command for manual web searches
- `webSearch` function calling tool for Grok AI to search the web automatically
- SerpAPI integration with free tier support (100 searches/month)
- Search results display with title, URL, and snippet
- Proper error handling for missing API keys and failed searches
- SERPAPI_KEY environment variable support in .env configuration
- **File operations function calling tools** - Read, write, and append files via function calling
- `readFile` function calling tool for reading text files from project directory
- `writeFile` function calling tool for creating or overwriting text files
- `appendFile` function calling tool for appending content to files
- Safety features: path traversal protection, project root restriction, UTF-8 only
- Automatic directory creation when writing to nested paths
- Comprehensive error handling for file operations
- src/tools/fileTools.ts module with sandboxed file operations

### Changed
- **Configuration loading** - Now loads from global `~/.grokcli/.env` directory first, with fallback to local .env
- Updated README.md with comprehensive global config setup instructions for all platforms
- Migrated local .env to global ~/.grokcli/.env directory for cross-directory accessibility
- Rebuilt project with global configuration support
- Integrated feature/search-api and feature/file-tools into master, unifying web search and file operation tools for function calling
- Updated project documentation structure to include AI workflow guidelines
- Improved opening message alignment - fixed box border spacing issues
- Simplified opening message layout for better readability
- Enhanced help command to include /exec usage information
- Enhanced Grok client to support OpenAI-compatible function calling API
- Modified chat function to handle tool calls in a loop until final response
- Updated README.md with function calling documentation and examples
- Refactored GrokClient to manage current model state internally
- Updated chat method to use instance model instead of parameter
- Enhanced help command to include model management commands
- Updated opening message to include /model command
- Clarified README to remove the non-existent /verbose command and note /search uses SerpAPI with SERPAPI_KEY configuration
### Fixed
- Fixed opening message box alignment - properly aligned text within the box borders
- Fixed 404 error from Grok API - updated model name from 'grok-beta' to 'grok-2-1212'
- Improved command list formatting in opening message
- Corrected opening message right border spacing - adjusted text padding to match box width exactly
- Removed extra vertical lines on right side of opening message box
- Adjusted spacing in opening message - reduced 6 spaces on line 2 and 2 spaces on line 4 for better alignment

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


