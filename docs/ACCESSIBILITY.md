# Accessibility Guide for Tailwind Traders Mail Services

## Overview

This document outlines the accessibility features implemented in the Tailwind Traders Mail Services application, including both the API documentation interface (Swagger UI) and the command-line interface (CLI).

## Table of Contents

1. [Accessibility Features](#accessibility-features)
2. [Screen Reader Support](#screen-reader-support)
3. [Keyboard Navigation](#keyboard-navigation)
4. [Visual Accessibility](#visual-accessibility)
5. [CLI Accessibility](#cli-accessibility)
6. [Testing Accessibility](#testing-accessibility)
7. [Best Practices](#best-practices)

## Accessibility Features

### Swagger UI (API Documentation)

The Swagger UI has been enhanced with the following accessibility features:

#### ARIA Labels and Roles
- All interactive elements have appropriate ARIA labels
- Operation blocks are marked with `role="button"` and `aria-expanded` states
- Form inputs have descriptive labels
- Response sections are properly labeled for screen readers

#### Live Region Announcements
- Dynamic content changes are announced to screen readers
- API execution status is announced
- Navigation state changes are communicated
- Uses `aria-live="polite"` for non-critical updates
- Uses `aria-live="assertive"` for important notifications

#### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the interface
- Skip navigation link to jump to main content
- Operation blocks can be expanded/collapsed with Enter or Space keys

### Command-Line Interface (CLI)

The CLI tool has been designed with accessibility in mind:

#### Screen Reader Compatibility
- Clear, descriptive prompts and messages
- Status updates are announced clearly
- Error messages are descriptive and actionable
- Progress indicators with text descriptions

#### Input Feedback
- Confirmation prompts for destructive actions
- Clear success/error messaging
- Descriptive help text for all commands

## Screen Reader Support

### Supported Screen Readers

The application has been tested with:
- **NVDA** (Windows)
- **JAWS** (Windows)
- **VoiceOver** (macOS)
- **Orca** (Linux)

### Key Screen Reader Features

#### Swagger UI
1. **Page Load Announcement**: When the API documentation loads, screen readers announce: "API documentation loaded. Press Alt + H for keyboard shortcuts."

2. **Operation Interaction**:
   - Navigate to an API operation
   - Screen reader announces: "[METHOD] [PATH] API operation"
   - Activate to expand: "GET /about operation expanded"
   - Activate to collapse: "GET /about operation collapsed"

3. **API Execution**:
   - When "Execute" is pressed: "Executing API request, please wait..."
   - When response received: "Response received with status [CODE]"

4. **Form Fields**:
   - Each input announces its parameter name and whether it's required
   - Example: "email parameter (required)"

#### CLI
1. **Command Feedback**:
   - Each action provides clear textual feedback
   - Success: "✓ Your broadcast file is ready to go..."
   - Error: "✕ Can't initialize, a /mail directory exists already."

2. **Interactive Prompts**:
   - All prompts are read clearly
   - Default values are announced
   - Current selection is indicated

## Keyboard Navigation

### Swagger UI Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Navigate to next interactive element |
| `Shift + Tab` | Navigate to previous interactive element |
| `Enter` or `Space` | Activate button or expand/collapse operation |
| `Escape` | Close expanded operation section |
| `Alt + H` | Display keyboard shortcuts help |
| `Alt + /` | Focus on search (if available) |

### Navigation Pattern

1. **Skip Link**: Press `Tab` once on page load to access skip navigation link
2. **Operations**: Navigate through API operations using `Tab`
3. **Expansion**: Use `Enter` or `Space` to expand/collapse operations
4. **Forms**: Tab through form fields, fill parameters
5. **Execute**: Tab to "Execute" button and press `Enter`

### CLI Keyboard Navigation

The CLI uses standard terminal navigation:
- Arrow keys for selection lists
- Tab for auto-completion (where supported)
- Enter to confirm selections
- Ctrl+C to cancel operations

## Visual Accessibility

### High Contrast Mode

The interface automatically adapts to high contrast mode preferences:

```css
@media (prefers-contrast: high) {
    /* Enhanced borders and outlines */
    .swagger-ui .opblock {
        border: 2px solid currentColor;
    }
}
```

### Focus Indicators

All interactive elements have visible focus indicators:
- 3px solid blue outline
- 2px offset for clarity
- Box shadow for additional emphasis
- Enhanced background color on focus

### Reduced Motion

Respects user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

### Color Contrast

All text meets WCAG 2.1 Level AA contrast requirements:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements have sufficient contrast in all states

### Touch Targets

All interactive elements meet the minimum touch target size:
- Minimum size: 44x44 pixels
- Adequate spacing between targets
- Large enough for precise interaction

## CLI Accessibility

### Command Structure

All CLI commands follow consistent patterns:

```bash
# General structure
mdmail <command> [options] <arguments>

# With help
mdmail <command> --help
```

For detailed CLI accessibility information, including screen reader support, keyboard navigation, and accessibility API, see the [CLI Accessibility Guide](CLI-ACCESSIBILITY.md).

### Visual Indicators

The CLI uses symbols for quick visual scanning:
- ✓ Success (green)
- ✕ Error (red)
- ℹ Information (blue)
- ⚠ Warning (yellow)

These are paired with descriptive text for screen reader users.

### Progress Feedback

Long-running operations provide feedback:
```
talking to api... ⠋  # Spinner with text
OK, here we go... be patient...
```

### Confirmation Prompts

Destructive actions require confirmation:
```
This is going to send this broadcast to 150 contacts. Proceed? (y | N)
```

## Testing Accessibility

### Automated Testing

Run accessibility tests using:

```bash
# For .NET API
cd server
dotnet test --filter Category=Accessibility

# For CLI (if tests exist)
cd cli
npm test -- --grep "accessibility"
```

### Manual Testing Checklist

#### Keyboard Navigation Test
- [ ] Can reach all interactive elements with Tab
- [ ] Can activate all buttons with Enter/Space
- [ ] Focus order is logical
- [ ] Focus is always visible
- [ ] No keyboard traps

#### Screen Reader Test
- [ ] All content is read in logical order
- [ ] Images have alt text
- [ ] Form fields have labels
- [ ] Dynamic content changes are announced
- [ ] Error messages are read clearly

#### Visual Test
- [ ] Text has sufficient contrast
- [ ] Focus indicators are visible
- [ ] Content is readable at 200% zoom
- [ ] Content works in high contrast mode
- [ ] UI respects reduced motion preferences

#### Color Blind Test
- [ ] Information not conveyed by color alone
- [ ] Links are distinguishable without color
- [ ] Status indicators have text/icons

### Browser Testing

Test on multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari

### Tools for Testing

1. **Automated Scanners**:
   - axe DevTools
   - WAVE Browser Extension
   - Lighthouse (Chrome DevTools)

2. **Screen Readers**:
   - NVDA (free, Windows)
   - VoiceOver (built-in, macOS)
   - JAWS (commercial, Windows)

3. **Browser Extensions**:
   - NoCoffee (vision impairment simulation)
   - Funkify (disability simulator)

## Best Practices

### For Developers

1. **Always include ARIA labels**:
   ```javascript
   button.setAttribute('aria-label', 'Submit form');
   ```

2. **Announce dynamic changes**:
   ```javascript
   announceToScreenReader('Form submitted successfully');
   ```

3. **Maintain focus management**:
   ```javascript
   // After closing modal, return focus
   previousFocusElement.focus();
   ```

4. **Use semantic HTML**:
   ```html
   <button> instead of <div onclick="">
   <nav> for navigation
   <main> for main content
   ```

5. **Test with keyboard only**:
   - Unplug your mouse
   - Navigate using only keyboard
   - Ensure all functionality is accessible

### For Content Creators

1. **Write descriptive link text**:
   - ❌ "Click here"
   - ✅ "View API documentation"

2. **Provide alternative text for images**:
   ```html
   <img src="diagram.png" alt="System architecture diagram showing three-tier design">
   ```

3. **Use headings hierarchically**:
   - Don't skip heading levels
   - Use H1 for page title
   - Use H2-H6 for subsections

4. **Write clear error messages**:
   - ❌ "Invalid input"
   - ✅ "Email address is required and must include an @ symbol"

### Common Pitfalls to Avoid

1. **Keyboard traps**: Ensure users can escape all interactive elements
2. **Missing labels**: All form inputs need labels
3. **Low contrast**: Test color combinations
4. **Timing issues**: Don't auto-advance content too quickly
5. **Hover-only content**: Ensure content is accessible without hover

## Resources

### Standards and Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Section 508 Standards](https://www.section508.gov/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Learning Resources
- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Getting Help

If you encounter accessibility issues:

1. **Check this documentation** for solutions
2. **File an issue** on GitHub with:
   - Description of the issue
   - Steps to reproduce
   - Browser and assistive technology used
   - Screenshots/recordings if applicable

3. **Contact the team** for urgent accessibility concerns

## Changelog

### Version 1.0.0 (Current)
- Initial accessibility implementation
- ARIA labels and live regions
- Keyboard navigation support
- Screen reader enhancements
- High contrast and reduced motion support
- Comprehensive documentation

## License

This documentation is part of the Tailwind Traders Mail Services project and is licensed under the MIT License.
