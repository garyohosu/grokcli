# AI Agent Instructions

This document provides instructions for AI agents (Claude Code, GitHub Copilot, or other AI assistants) working on the Grok CLI project.

## Purpose

This project is a command-line interface tool that provides interactive chat capabilities powered by the Grok API. The goal is to create a user-friendly, Claude Code-inspired terminal experience.

## Required Workflow

### On Startup

When beginning any work session on this project, AI agents MUST:

1. **Read CHANGELOG.md**
   ```bash
   cat CHANGELOG.md
   ```
   - Understand recent changes
   - Review current version status
   - Check the `[Unreleased]` section for ongoing work
   - Familiarize with project history

2. **Understand Project State**
   - Review package.json for dependencies
   - Check README.md for current documentation
   - Examine source code structure in src/
   - Note any build or configuration changes

### During Work

While making changes:

1. **Follow Project Standards**
   - Use TypeScript with strict type checking
   - Follow existing code patterns and style
   - Maintain the Claude Code-inspired UX
   - Keep slash commands consistent

2. **Test Changes**
   - Run `npm run build` to verify TypeScript compilation
   - Test CLI functionality manually
   - Verify all slash commands work correctly
   - Check error handling

3. **Document as You Go**
   - Add inline comments for complex logic
   - Update type definitions
   - Keep code self-documenting

### On Completion

After completing work, AI agents MUST:

1. **Update CHANGELOG.md**
   - Add all changes to the `[Unreleased]` section
   - Use appropriate categories:
     - `Added` - New features or files
     - `Changed` - Modifications to existing features
     - `Deprecated` - Features marked for removal
     - `Removed` - Deleted features or files
     - `Fixed` - Bug fixes
     - `Security` - Security-related changes
   - Write clear, concise descriptions
   - Follow Keep a Changelog format

2. **Build the Project**
   ```bash
   npm run build
   ```
   - Ensure no TypeScript errors
   - Verify successful compilation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "Descriptive commit message

   - List major changes
   - Include relevant details
   - Reference issues if applicable

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

4. **Push to Remote**
   ```bash
   git push origin master
   ```

## Project Structure

```
grokcli/
├── src/
│   ├── index.ts          # Main CLI entry point
│   └── grok-client.ts    # Grok API client
├── dist/                 # Compiled output
├── .env.example          # Environment variable template
├── CHANGELOG.md          # Project change log (READ THIS FIRST!)
├── Claude.md             # Claude Code workflow instructions
├── Agents.md             # This file - AI agent instructions
├── README.md             # User documentation
├── LICENSE               # MIT License
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## Key Features to Maintain

1. **Claude Code-inspired UX**
   - Simple, clean interface
   - Slash command support
   - Clear prompts and messages
   - Helpful error messages

2. **Slash Commands**
   - `/help` - Show available commands
   - `/clear` - Clear conversation history
   - `/exit` - Exit application
   - `/version` - Show version info

3. **User Experience**
   - Interactive chat mode by default
   - Conversation history tracking
   - Loading spinners for API calls
   - Color-coded output

## Code Style Guidelines

### TypeScript
- Use strict type checking
- Define interfaces for complex objects
- Avoid `any` type
- Use async/await for promises

### Formatting
- Use 2 spaces for indentation
- Single quotes for strings
- Semicolons at end of statements
- Clear variable names

### Comments
- Add JSDoc comments for public functions
- Explain complex algorithms
- Document parameters and return types
- Keep comments up to date

## Common Tasks

### Adding a New Slash Command

1. Add handler in `handleCommand()` function
2. Update help text in `showHelp()` function
3. Add to OPENING_MESSAGE command list
4. Test the command
5. Update CHANGELOG.md
6. Update README.md if user-facing

### Modifying Grok API Integration

1. Update `grok-client.ts`
2. Maintain type safety
3. Handle errors gracefully
4. Test with API
5. Document changes in CHANGELOG.md

### Updating Dependencies

1. Update package.json
2. Run `npm install`
3. Test functionality
4. Run `npm run build`
5. Document in CHANGELOG.md

## Error Handling

- Provide clear, actionable error messages
- Suggest solutions when possible
- Handle API errors gracefully
- Never expose sensitive information in errors

## Security Considerations

- Never commit API keys or secrets
- Keep .env files local only
- Validate user input
- Handle errors without exposing internals
- Keep dependencies up to date

## Release Checklist

When preparing a release:

- [ ] All features tested
- [ ] Build succeeds without errors
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] README.md reflects current features
- [ ] Git tag created
- [ ] Changes pushed to remote

## Questions?

Refer to:
- README.md - For user-facing documentation
- Claude.md - For Claude Code-specific workflows
- CHANGELOG.md - For project history
- package.json - For dependencies and scripts

## Important Reminders

🚨 **ALWAYS read CHANGELOG.md on startup**
🚨 **ALWAYS update CHANGELOG.md after making changes**
🚨 **ALWAYS commit and push changes when done**

Following these instructions ensures consistency, maintainability, and clear project history.
