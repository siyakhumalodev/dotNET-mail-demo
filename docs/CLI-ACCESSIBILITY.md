# CLI Accessibility Guide

## Overview

This guide provides information about using the Tailwind Traders Mail CLI with assistive technologies, particularly screen readers.

## Accessibility Features

### Screen Reader Support

The CLI has been designed to work well with popular screen readers:
- **Windows**: NVDA, JAWS, Narrator
- **macOS**: VoiceOver
- **Linux**: Orca

### Key Features

1. **Clear Textual Output**: All visual indicators (spinners, progress bars) have textual equivalents
2. **Descriptive Messages**: All operations announce their status clearly
3. **Keyboard Navigation**: Full keyboard support with standard terminal navigation
4. **Confirmation Prompts**: Destructive actions always require explicit confirmation

## Using the CLI

### Getting Help

For any command, use the `--help` flag:

```bash
mdmail --help
mdmail broadcast --help
mdmail contact --help
```

Screen readers will announce the help text clearly.

### Command Structure

All commands follow a consistent pattern:

```
mdmail <command> [options] <arguments>
```

### Navigation

#### Arrow Keys
- Up/Down: Navigate through selection lists
- Left/Right: Edit text in input fields

#### Tab Key
- Auto-completion (where supported)
- Navigation in some prompts

#### Enter Key
- Confirm selection
- Submit input
- Execute command

#### Escape/Ctrl+C
- Cancel current operation
- Exit prompts

### Interactive Prompts

The CLI uses the Inquirer library for interactive prompts. Screen reader tips:

1. **Selection Lists**: Use arrow keys to navigate, press Enter to select
2. **Text Input**: Type your response and press Enter
3. **Confirmation**: Type 'y' for yes or 'n' for no, then press Enter

### Example: Creating a Broadcast

```bash
# Initialize the mail directory (first time only)
mdmail init
# Screen reader announces: "About to create a /mail directory for you. Proceed?"

# Create a new broadcast
mdmail broadcast new "Welcome Email"
# Screen reader announces: "Want to set this up with an OpenAI prompt?"
# Navigate through prompts with Tab/Enter
```

### Status Messages

The CLI provides clear status messages:

- ✓ Success messages (announced as "Success: ...")
- ✕ Error messages (announced as "Error: ...")
- ℹ Information (announced as "Info: ...")
- ⚠ Warnings (announced as "Warning: ...")

These symbols are paired with descriptive text for screen reader users.

## Accessibility Helper Functions

For developers extending the CLI, use the accessibility helper module:

```javascript
const a11y = require('./lib/accessibility');

// Announce messages
a11y.announce('Operation started', 'info');
a11y.announce('Task completed!', 'success');
a11y.announce('Something went wrong', 'error');

// Announce lists
a11y.announceList(broadcasts, 'broadcast');
// Output: "Found 3 broadcasts"
// "1 of 3: welcome-email.md"
// "2 of 3: newsletter.md"
// "3 of 3: announcement.md"

// Accessible progress
const progress = a11y.createAccessibleProgress('Sending emails');
progress.update('50% complete');
progress.complete(true, 'All emails sent');

// Confirmation prompts
a11y.announceConfirmationPrompt('Delete all contacts', true);
// Output: "Confirmation required for: Delete all contacts 
//         (Warning: This action cannot be undone)"
```

## Terminal Configuration

### Recommended Settings

1. **Terminal Echo**: Ensure your terminal has echo enabled
2. **Sound Feedback**: Enable sound feedback in your screen reader
3. **Verbosity**: Set screen reader to verbose mode for detailed output

### Windows (NVDA)

```
NVDA Menu > Preferences > Settings > Speech
- Set "Symbol Level" to "All"
- Enable "Report command line output"
```

### macOS (VoiceOver)

```
VoiceOver Utility > Verbosity > Text
- Check "Speak all punctuation"
- Enable "Speak terminal output"
```

### Linux (Orca)

```
Orca Preferences > Speech > Punctuation Level
- Set to "All"
```

## Common Issues and Solutions

### Issue: Spinner interferes with screen reader

**Solution**: The CLI announces operations before starting spinners:
```
"Talking to API..." (announced)
[spinner runs silently]
"Operation completed" (announced)
```

### Issue: Can't hear selection in lists

**Solution**: 
1. Ensure your screen reader is in focus mode
2. Use arrow keys to navigate (you'll hear each option)
3. Press Enter to select

### Issue: Error messages not clear

**Solution**: All error messages include:
- What went wrong
- Why it went wrong (when possible)
- How to fix it

Example:
```
Error: Can't initialize, a /mail directory exists already.
Solution: Delete the existing /mail directory or use a different location.
```

## Best Practices for CLI Users

1. **Read Help First**: Always run `--help` to understand command options
2. **Use Confirmation**: Pay attention to confirmation prompts, especially for destructive actions
3. **Check Output**: Review command output to ensure operations completed successfully
4. **Use History**: Use Up arrow to recall previous commands

## Best Practices for Developers

When extending the CLI, follow these guidelines:

### DO:
- ✅ Use the accessibility helper module for all user feedback
- ✅ Provide clear, descriptive messages
- ✅ Announce before and after long-running operations
- ✅ Use consistent language across commands
- ✅ Require confirmation for destructive actions

### DON'T:
- ❌ Rely on color alone to convey information
- ❌ Use visual-only indicators (spinners without text)
- ❌ Create keyboard traps
- ❌ Use ambiguous error messages
- ❌ Skip confirmation for destructive operations

### Example: Good vs Bad

**Bad:**
```javascript
console.log('❌'); // No context
spinner.start(); // No announcement
```

**Good:**
```javascript
a11y.announce('Operation failed: Invalid email format', 'error');
a11y.accessibleSpinner('Sending emails', async () => {
    // operation
});
```

## Testing with Screen Readers

### Quick Test Checklist

- [ ] Launch screen reader before starting CLI
- [ ] Run common commands (init, broadcast new, etc.)
- [ ] Navigate through prompts using only keyboard
- [ ] Verify all messages are read clearly
- [ ] Test error scenarios
- [ ] Verify confirmation prompts are clear
- [ ] Test with different verbosity settings

### Testing Script

```bash
# Test basic help
mdmail --help

# Test initialization
mdmail init

# Test broadcast creation
mdmail broadcast new "Test Email"

# Test list navigation
mdmail broadcast validate
# (if multiple files exist)

# Test error handling
mdmail broadcast send
# (with no valid broadcast)
```

## Keyboard Shortcuts Reference

| Action | Shortcut | Description |
|--------|----------|-------------|
| Cancel operation | Ctrl+C | Exit current operation |
| Previous command | Up Arrow | Recall previous command from history |
| Next command | Down Arrow | Recall next command from history |
| Navigate list | Up/Down | Move through selection lists |
| Select option | Enter | Confirm current selection |
| Auto-complete | Tab | Complete command or path (if supported) |
| Clear line | Ctrl+U | Clear current input line |
| Move to start | Home | Move cursor to line start |
| Move to end | End | Move cursor to line end |

## Accessibility API

For developers building on top of the CLI:

```javascript
const a11y = require('./lib/accessibility');

// Available functions:
a11y.announce(message, type)
a11y.announceProgress(action, status)
a11y.announceList(items, itemType)
a11y.createAccessiblePrompt(question, defaultValue, required)
a11y.announceCompletion(command, success, details)
a11y.announceValidationErrors(errors)
a11y.announceKeyboardShortcuts(shortcuts)
a11y.createAccessibleProgress(action)
a11y.announceTable(rows, columns)
a11y.announceConfirmationPrompt(action, destructive)
a11y.accessibleSpinner(message, operation)
```

## Resources

### Screen Reader Documentation
- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)
- [Orca Screen Reader Wiki](https://help.gnome.org/users/orca/stable/)

### Terminal Accessibility
- [Accessible Terminal Usage](https://www.a11yproject.com/posts/2013-01-22-terminal-accessibility/)
- [CLI Guidelines](https://clig.dev/)

## Getting Help

If you encounter accessibility issues with the CLI:

1. Check this documentation
2. Try running with `--help` for command-specific guidance
3. File an issue on GitHub with:
   - Screen reader name and version
   - Terminal/shell name and version
   - Command that caused the issue
   - Expected vs actual behavior

## Contributing

To improve CLI accessibility:

1. Test with multiple screen readers
2. Follow accessibility best practices
3. Use the accessibility helper module
4. Document any new patterns
5. Submit pull requests with tests

## Version History

### v1.0.0
- Initial accessibility implementation
- Accessibility helper module
- Screen reader optimizations
- Comprehensive documentation
