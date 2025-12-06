# Accessibility Testing Guide

## Overview

This guide provides comprehensive instructions for testing the accessibility features of the Tailwind Traders Mail Services application, including both the API documentation (Swagger UI) and the CLI tool.

## Table of Contents

1. [Automated Testing](#automated-testing)
2. [Manual Testing](#manual-testing)
3. [Screen Reader Testing](#screen-reader-testing)
4. [Keyboard Navigation Testing](#keyboard-navigation-testing)
5. [Visual Accessibility Testing](#visual-accessibility-testing)
6. [CLI Accessibility Testing](#cli-accessibility-testing)
7. [Testing Checklist](#testing-checklist)
8. [Reporting Issues](#reporting-issues)

## Automated Testing

### Tools Required

1. **axe DevTools** - Browser extension for automated accessibility testing
   - [Chrome Extension](https://chrome.google.com/webstore/detail/axe-devtools)
   - [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)

2. **Lighthouse** - Built into Chrome DevTools
   - Open DevTools → Lighthouse tab
   - Select "Accessibility" category

3. **WAVE** - Web accessibility evaluation tool
   - [Chrome Extension](https://chrome.google.com/webstore/detail/wave-evaluation-tool)
   - [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool/)

### Running Automated Tests

#### Using axe DevTools

1. Start the server:
   ```bash
   cd server
   dotnet run
   ```

2. Open the application in your browser (http://localhost:5000)

3. Open DevTools (F12) → axe DevTools tab

4. Click "Scan ALL of my page"

5. Review results:
   - **Violations**: Must be fixed
   - **Needs Review**: Requires manual verification
   - **Passed**: Accessibility rules passed

Expected Results:
- 0 critical violations
- 0 serious violations
- Any moderate/minor violations should have documented exceptions

#### Using Lighthouse

1. Open Chrome DevTools (F12)

2. Navigate to Lighthouse tab

3. Select:
   - ✅ Accessibility
   - Device: Desktop
   - Click "Analyze page load"

4. Review the report

Expected Score: 95+ (100 is ideal)

#### Using WAVE

1. Install WAVE extension

2. Navigate to http://localhost:5000

3. Click WAVE icon in browser toolbar

4. Review:
   - Errors (red): Must fix
   - Alerts (yellow): Review manually
   - Features (green): Accessibility features detected
   - Structural elements: Proper HTML structure

### Continuous Integration

For CI/CD integration, use axe-core programmatically:

```javascript
// Example test script
const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5000');
  
  const results = await new AxePuppeteer(page).analyze();
  
  console.log('Violations:', results.violations.length);
  
  if (results.violations.length > 0) {
    console.error('Accessibility violations found:', results.violations);
    process.exit(1);
  }
  
  await browser.close();
})();
```

## Manual Testing

### Prerequisites

- Keyboard (no mouse)
- Screen reader (NVDA, JAWS, VoiceOver, or Orca)
- Browser (Chrome, Firefox, or Safari)

### Test Environment Setup

1. Start the server:
   ```bash
   cd server
   dotnet run
   ```

2. Open browser to http://localhost:5000

3. Start your screen reader

4. Disable your mouse (or physically disconnect it)

## Screen Reader Testing

### NVDA (Windows - Free)

#### Installation
1. Download from [nvaccess.org](https://www.nvaccess.org/download/)
2. Install and restart
3. NVDA starts with `Ctrl + Alt + N`

#### Basic Controls
- Start/Stop: `Ctrl + Alt + N`
- Stop speech: `Ctrl`
- Next element: `Tab`
- Read line: `Insert + Up Arrow`
- Read all: `Insert + Down Arrow`

#### Testing Steps

1. **Page Load Test**
   ```
   Start NVDA → Navigate to app → Listen for:
   "API documentation loaded. Press Alt + H for keyboard shortcuts."
   ```
   ✅ Should announce page ready
   ✅ Should provide keyboard shortcut hint

2. **Navigation Test**
   ```
   Press Tab repeatedly
   ```
   ✅ Should announce each interactive element
   ✅ Should describe element type (button, link, etc.)
   ✅ Should read labels and descriptions

3. **Operation Expansion Test**
   ```
   Tab to an API operation → Press Enter
   ```
   ✅ Should announce: "[METHOD] [PATH] operation expanded"
   ✅ Should read operation details when expanded

4. **Form Interaction Test**
   ```
   Expand operation → Tab to "Try it out" → Enter
   Tab through parameter fields
   ```
   ✅ Should announce field labels
   ✅ Should indicate required fields
   ✅ Should read field descriptions

5. **API Execution Test**
   ```
   Fill parameters → Tab to Execute → Enter
   ```
   ✅ Should announce: "Executing API request, please wait..."
   ✅ Should announce: "Response received with status [CODE]"

### VoiceOver (macOS - Built-in)

#### Activation
- Enable: `Cmd + F5`
- Quick start: `Cmd + F5` (toggle)

#### Basic Controls
- Start/Stop: `Cmd + F5`
- Move forward: `Ctrl + Option + Right Arrow`
- Move backward: `Ctrl + Option + Left Arrow`
- Interact with element: `Ctrl + Option + Space`
- Read all: `Ctrl + Option + A`

#### Testing Steps
Follow same steps as NVDA testing above, using VoiceOver commands.

### JAWS (Windows - Commercial)

#### Basic Controls
- Start: `Ctrl + Alt + J`
- Next element: `Tab`
- Read line: `Insert + Up Arrow`
- Read all: `Insert + Down Arrow`

#### Testing Steps
Follow same steps as NVDA testing above, using JAWS commands.

### Orca (Linux - Free)

#### Activation
```bash
# Install
sudo apt-get install orca

# Start
orca
```

#### Basic Controls
- Start/Stop: `Super + Alt + S`
- Next element: `Tab`
- Read line: `Insert + Up Arrow`
- Read all: `Insert + Down Arrow`

#### Testing Steps
Follow same steps as NVDA testing above, using Orca commands.

## Keyboard Navigation Testing

### Test Without Mouse

**Completely disconnect or disable your mouse** to ensure true keyboard-only testing.

### Navigation Tests

#### 1. Skip Navigation Link
```
Action: Press Tab once on page load
Expected: Focus on "Skip to API documentation" link
Expected: Link is visible
Expected: Pressing Enter jumps to main content
```

#### 2. Tab Order
```
Action: Tab through all interactive elements
Expected: Logical order (top to bottom, left to right)
Expected: No elements skipped
Expected: No keyboard traps
Expected: Visible focus indicator on each element
```

#### 3. Operation Expansion
```
Action: Tab to operation → Press Enter or Space
Expected: Operation expands/collapses
Expected: Announced to screen reader
Expected: aria-expanded attribute updates
```

#### 4. Form Navigation
```
Action: Tab through form fields
Expected: All fields are reachable
Expected: Tab order is logical
Expected: Can edit all fields with keyboard
```

#### 5. Button Activation
```
Action: Tab to button → Press Enter or Space
Expected: Button activates
Expected: Action is performed
Expected: Feedback is provided
```

#### 6. Escape Key
```
Action: Expand operation → Press Escape
Expected: Operation collapses
Expected: Focus returns to appropriate element
```

#### 7. Keyboard Shortcuts
```
Action: Press Alt + H
Expected: Help dialog appears
Expected: Lists all keyboard shortcuts
Expected: Can be closed with Escape or Enter
```

### Focus Indicator Test

All focused elements should have:
- ✅ 3px solid outline (#4A90E2)
- ✅ 2px offset from element
- ✅ Box shadow for emphasis
- ✅ Sufficient contrast (4.5:1 minimum)

### Focus Trap Test

Verify there are no focus traps:
```
1. Tab through entire page
2. Ensure you can reach all interactive elements
3. Ensure you can Tab backward with Shift+Tab
4. Ensure focus never gets stuck
```

## Visual Accessibility Testing

### Color Contrast Testing

#### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools (Inspect → Accessibility pane)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

#### Requirements
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt or ≥ 14pt bold): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

#### Test Cases
```
1. Check text against background
2. Check link color against background
3. Check button text against button background
4. Check focus indicator against background
5. Check error messages against background
```

### High Contrast Mode Testing

#### Windows High Contrast Mode
```
Settings → Ease of Access → High Contrast → 
Choose a theme → Apply
```

Test checklist:
- [ ] All text is visible
- [ ] All borders are visible
- [ ] Focus indicators are visible
- [ ] Icons have text alternatives
- [ ] No information conveyed by color alone

#### Browser High Contrast Extensions
- [High Contrast (Chrome)](https://chrome.google.com/webstore/detail/high-contrast)

### Color Blindness Testing

#### Tools
- [Colorblindly (Chrome)](https://chrome.google.com/webstore/detail/colorblindly)
- [Color Oracle](https://colororacle.org/) (Desktop app)

#### Test Modes
Test with each type:
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Achromatopsia (total color blindness)

#### Checklist
- [ ] Status indicators have icons/text, not just color
- [ ] Links are distinguishable without color
- [ ] Error/success messages are clear without color
- [ ] Charts/graphs have patterns, not just colors

### Zoom and Reflow Testing

#### 200% Zoom Test
```
Browser: Ctrl + (zoom in to 200%)
```
- [ ] No horizontal scrolling
- [ ] All content is readable
- [ ] No overlapping text
- [ ] Interactive elements remain clickable

#### 400% Zoom Test (WCAG 2.1 AAA)
```
Browser: Zoom to 400%
```
- [ ] Content reflows appropriately
- [ ] No loss of information
- [ ] No loss of functionality

### Reduced Motion Testing

#### Enable Reduced Motion
**Windows:**
```
Settings → Ease of Access → Display → 
Show animations in Windows → Off
```

**macOS:**
```
System Preferences → Accessibility → Display → 
Reduce motion → On
```

**Browser DevTools:**
```
Chrome DevTools → ⋮ → More tools → Rendering → 
Emulate CSS media feature prefers-reduced-motion: reduce
```

#### Test
- [ ] Animations are removed or reduced
- [ ] Transitions are instant
- [ ] No jarring motion
- [ ] Functionality still works

## CLI Accessibility Testing

### Terminal Setup

Use a screen reader with terminal support:
- **Windows**: NVDA + Command Prompt/PowerShell
- **macOS**: VoiceOver + Terminal
- **Linux**: Orca + Terminal

### Basic CLI Tests

#### 1. Help Text
```bash
mdmail --help
```
Expected:
- ✅ Screen reader reads help text clearly
- ✅ Command structure is understandable
- ✅ Options are described clearly

#### 2. Interactive Prompts
```bash
mdmail init
```
Expected:
- ✅ Prompt question is read clearly
- ✅ Default value is announced
- ✅ Input is echoed back
- ✅ Confirmation is required

#### 3. List Navigation
```bash
mdmail broadcast validate
# (when multiple files exist)
```
Expected:
- ✅ Number of items announced
- ✅ Current selection is read
- ✅ Arrow keys navigate
- ✅ Enter confirms selection

#### 4. Error Messages
```bash
# Run invalid command
mdmail broadcast send
# (when no valid broadcast exists)
```
Expected:
- ✅ Error is announced clearly
- ✅ Reason is explained
- ✅ Solution is suggested

#### 5. Success Messages
```bash
# Run valid operation
```
Expected:
- ✅ Success is announced
- ✅ Result details are provided
- ✅ Next steps are suggested (if applicable)

### CLI-Specific Tests

Test the accessibility helper module:

```bash
# Create test script
node -e "
const a11y = require('./cli/lib/accessibility');
a11y.announce('Test announcement', 'info');
a11y.announceList([{name: 'Item 1'}, {name: 'Item 2'}], 'test');
console.log('If you heard the announcements, the test passed!');
"
```

## Testing Checklist

### Swagger UI Accessibility

- [ ] Skip navigation link works
- [ ] All content is keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Screen reader announces all content
- [ ] ARIA labels are present and correct
- [ ] Live regions announce dynamic changes
- [ ] Keyboard shortcuts work (Alt+H)
- [ ] Forms are properly labeled
- [ ] Buttons describe their action
- [ ] Operations expand/collapse with keyboard
- [ ] Error messages are accessible
- [ ] Success messages are announced
- [ ] High contrast mode works
- [ ] Reduced motion is respected
- [ ] Content works at 200% zoom
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] No keyboard traps exist

### CLI Accessibility

- [ ] Help text is clear
- [ ] Commands follow consistent patterns
- [ ] Prompts are read by screen readers
- [ ] Errors are descriptive
- [ ] Success messages are clear
- [ ] Lists are navigable
- [ ] Confirmations are required for destructive actions
- [ ] Progress is announced
- [ ] No visual-only indicators
- [ ] Keyboard navigation works
- [ ] Terminal echo is clear

### Automated Tool Results

- [ ] axe DevTools: 0 violations
- [ ] Lighthouse: Score 95+
- [ ] WAVE: 0 errors
- [ ] No console errors related to accessibility

## Reporting Issues

When you find an accessibility issue:

### Information to Include

1. **Issue Description**: Clear description of the problem
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - Browser and version
   - Screen reader and version (if applicable)
   - Operating system
   - Zoom level (if applicable)
6. **WCAG Criterion**: Which WCAG criterion is violated (if known)
7. **Severity**: 
   - Critical: Prevents use of core functionality
   - High: Significantly impairs use
   - Medium: Causes difficulty but workarounds exist
   - Low: Minor inconvenience
8. **Screenshots/Video**: Visual documentation if helpful

### Example Issue Report

```
Title: Submit button not keyboard accessible

Description:
The "Execute" button for API operations cannot be activated 
with Enter or Space key.

Steps to Reproduce:
1. Navigate to http://localhost:5000
2. Expand GET /about operation
3. Click "Try it out"
4. Tab to "Execute" button
5. Press Enter

Expected: API request executes
Actual: Nothing happens

Environment:
- Browser: Chrome 120.0.6099.129
- Screen Reader: NVDA 2023.3
- OS: Windows 11
- Zoom: 100%

WCAG Criterion: 2.1.1 Keyboard (Level A)
Severity: Critical
```

## Best Practices

### For Testers

1. **Test Early and Often**: Don't wait until the end
2. **Use Real Assistive Technologies**: Don't just use dev tools
3. **Test Multiple Browsers**: Chrome, Firefox, Safari
4. **Test Multiple Screen Readers**: NVDA, JAWS, VoiceOver
5. **Test Without Mouse**: Unplug it entirely
6. **Test at Different Zoom Levels**: 100%, 200%, 400%
7. **Document Everything**: Screenshots, videos, detailed notes
8. **Involve Users with Disabilities**: Nothing beats real user testing

### For Developers

1. **Build Accessibility In**: Don't bolt it on later
2. **Use Semantic HTML**: Proper elements for proper purposes
3. **Test Your Own Code**: Run the tests yourself
4. **Fix Issues Immediately**: Don't accumulate accessibility debt
5. **Automate Where Possible**: CI/CD accessibility checks
6. **Stay Updated**: WCAG and best practices evolve

## Resources

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Screen Readers
- [NVDA](https://www.nvaccess.org/) (Windows, Free)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Windows, Commercial)
- VoiceOver (macOS/iOS, Built-in)
- [Orca](https://help.gnome.org/users/orca/stable/) (Linux, Free)

### Standards
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Learning
- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)
- [Deque University](https://dequeuniversity.com/)

## Continuous Testing

Integrate accessibility testing into your workflow:

### Pull Request Checklist
- [ ] Ran automated tests (axe, Lighthouse)
- [ ] Tested keyboard navigation
- [ ] Tested with screen reader (at least one)
- [ ] Verified color contrast
- [ ] Tested at 200% zoom
- [ ] No new accessibility violations

### Release Checklist
- [ ] Full manual accessibility audit
- [ ] Tested with multiple screen readers
- [ ] Tested on multiple browsers
- [ ] Tested on multiple devices
- [ ] User testing with people with disabilities
- [ ] Updated accessibility documentation
- [ ] Resolved all critical and high severity issues

## Getting Help

Need help with accessibility testing?

- Check the [Accessibility Guide](ACCESSIBILITY.md)
- Review the [CLI Accessibility Guide](CLI-ACCESSIBILITY.md)
- Ask in GitHub Discussions
- File an issue with questions
- Contact the accessibility team

---

Remember: Accessibility is not a feature, it's a requirement. Good accessibility benefits everyone, not just people with disabilities.
