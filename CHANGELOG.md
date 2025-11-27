# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Claude.md - Workflow instructions for Claude Code integration
- Agents.md - Instructions for AI agents working on this project
- Automated workflow for reading CHANGELOG.md on startup and updating it after work completion
- Added /version command to opening message command list
- Added /exec command for executing shell commands directly from Grok CLI
- Command execution functionality with proper error handling and output display
- **Function calling support** - Grok AI can now execute shell commands automatically when needed
- OS detection utility to distinguish between Windows, Linux, and macOS
- Cross-platform shell command execution with OS-specific command handling
- Tool definitions for shell command execution with proper parameter validation
- Iterative tool call handling with conversation context preservation

### Changed
- Updated project documentation structure to include AI workflow guidelines
- Improved opening message alignment - fixed box border spacing issues
- Simplified opening message layout for better readability
- Enhanced help command to include /exec usage information
- Enhanced Grok client to support OpenAI-compatible function calling API
- Modified chat function to handle tool calls in a loop until final response
- Updated README.md with function calling documentation and examples

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
