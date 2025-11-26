# Claude Code Workflow Instructions

This document provides workflow guidelines for Claude Code when working on the Grok CLI project.

## Startup Workflow

When starting work on this project, Claude Code should:

1. **Read CHANGELOG.md** - Review the project's change history to understand:
   - Recent changes and features
   - Current version status
   - Ongoing work in the `[Unreleased]` section
   - Project evolution and direction

2. **Review Project Context** - Understand the current state:
   - Check package.json for dependencies and scripts
   - Review README.md for project overview
   - Examine src/ directory structure
   - Check for any open issues or TODOs

## Work Completion Workflow

After completing any work session, Claude Code should:

1. **Update CHANGELOG.md** - Document all changes:
   - Add changes to the `[Unreleased]` section
   - Categorize changes appropriately:
     - `Added` - New features
     - `Changed` - Changes to existing functionality
     - `Deprecated` - Soon-to-be removed features
     - `Removed` - Removed features
     - `Fixed` - Bug fixes
     - `Security` - Security improvements
   - Use clear, concise descriptions
   - Follow Keep a Changelog format

2. **Create Git Commit** - Commit all changes:
   - Write descriptive commit messages
   - Include bullet points for major changes
   - Follow conventional commit format when applicable
   - Include co-authorship attribution

3. **Push to Remote** - Push changes to GitHub:
   - Ensure all files are staged
   - Push to the appropriate branch
   - Verify push success

## Best Practices

### Code Changes
- Follow TypeScript best practices
- Maintain existing code style
- Add comments for complex logic
- Update type definitions as needed

### Documentation
- Keep README.md up to date
- Document new features and commands
- Update examples when behavior changes
- Maintain accurate API documentation

### Version Control
- Make atomic commits
- Write meaningful commit messages
- Keep commits focused on single concerns
- Update CHANGELOG.md with every commit

### Testing
- Test changes before committing
- Verify build succeeds (`npm run build`)
- Check for TypeScript errors
- Test CLI commands manually when modified

## Release Process

When preparing a release:

1. Update version in package.json
2. Move `[Unreleased]` changes to a new version section in CHANGELOG.md
3. Update the version comparison links at bottom of CHANGELOG.md
4. Create a git tag for the version
5. Push tag to trigger release workflow (if configured)

## Example Workflow

```bash
# 1. Start work - read CHANGELOG.md
cat CHANGELOG.md

# 2. Make changes to code
# ... edit files ...

# 3. Build and test
npm run build

# 4. Update CHANGELOG.md
# ... add changes to [Unreleased] section ...

# 5. Commit changes
git add .
git commit -m "Add new feature X

- Implement feature X functionality
- Add tests for feature X
- Update documentation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 6. Push to remote
git push origin master
```

## Notes

- Always maintain the CHANGELOG.md as the source of truth for project changes
- Be consistent with formatting and categorization
- Keep the workflow automated and predictable
- Communicate changes clearly to future developers and AI agents
