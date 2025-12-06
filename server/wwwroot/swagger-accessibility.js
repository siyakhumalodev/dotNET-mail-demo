/**
 * Swagger UI Accessibility Enhancements
 * This script adds ARIA attributes, keyboard navigation, and screen reader support
 * to the Swagger UI interface for improved accessibility.
 */

(function() {
    'use strict';
    
    /**
     * Create an ARIA live region for screen reader announcements
     * WCAG 4.1.3: Status Messages - Dynamic content changes must be announced
     * The live region is visually hidden but accessible to screen readers
     */
    function createLiveRegion() {
        // Check if live region already exists to avoid duplicates
        if (document.getElementById('aria-live-region')) {
            return; // Already exists
        }
        
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        
        // WCAG 4.1.3: role="status" indicates this is a status update region
        liveRegion.setAttribute('role', 'status');
        
        // aria-live="polite" means announcements won't interrupt current speech
        // Use "assertive" only for critical updates (errors, warnings)
        liveRegion.setAttribute('aria-live', 'polite');
        
        // aria-atomic="true" means the entire region content is announced as one unit
        liveRegion.setAttribute('aria-atomic', 'true');
        
        // Visually hide the live region while keeping it accessible to screen readers
        // Position off-screen instead of using display:none or visibility:hidden
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        
        // Insert at beginning of body to ensure it's discovered early
        document.body.insertBefore(liveRegion, document.body.firstChild);
    }
    
    /**
     * Announce a message to screen readers via ARIA live region
     * @param {string} message - The message to announce
     * @param {string} priority - 'polite' (default) or 'assertive' for urgent messages
     * 
     * WCAG 4.1.3: Ensures dynamic content changes are communicated to users
     */
    function announceToScreenReader(message, priority = 'polite') {
        const liveRegion = document.getElementById('aria-live-region');
        if (!liveRegion) return;
        
        // Set priority level: 'polite' won't interrupt, 'assertive' will
        // Use 'assertive' sparingly for critical updates only
        liveRegion.setAttribute('aria-live', priority);
        
        // Clear the region first, then set message after a brief delay
        // This ensures screen readers detect the change and announce it
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }
    
    /**
     * Enhance operation blocks with accessibility features
     * Adds ARIA attributes and keyboard navigation to API operation cards
     * Complies with WCAG 2.1.1 (Keyboard) and 4.1.2 (Name, Role, Value)
     */
    function enhanceOperations() {
        // Select only operations that haven't been enhanced yet to avoid duplicate processing
        const operations = document.querySelectorAll('.opblock:not([data-a11y-enhanced])');
        
        operations.forEach((op) => {
            // Mark as enhanced to prevent reprocessing on subsequent calls
            op.setAttribute('data-a11y-enhanced', 'true');
            
            const method = op.querySelector('.opblock-summary-method');
            const path = op.querySelector('.opblock-summary-path');
            const summary = op.querySelector('.opblock-summary');
            
            if (method && path) {
                const methodText = method.textContent.trim();
                const pathText = path.textContent.trim();
                
                // WCAG 4.1.2: Provide accessible name for the operation
                // Screen readers will announce: "GET /about API operation"
                op.setAttribute('aria-label', `${methodText} ${pathText} API operation`);
                
                if (summary) {
                    // WCAG 4.1.2: Define the role as button since it's clickable
                    summary.setAttribute('role', 'button');
                    
                    // WCAG 4.1.3: Communicate expansion state to screen readers
                    summary.setAttribute('aria-expanded', 'false');
                    
                    // WCAG 2.1.1: Make keyboard focusable if not already
                    if (!summary.hasAttribute('tabindex')) {
                        summary.setAttribute('tabindex', '0');
                    }
                    
                    // Track expansion state changes using MutationObserver
                    // This ensures aria-expanded stays in sync with visual state
                    const observer = new MutationObserver(() => {
                        const isExpanded = op.classList.contains('is-open');
                        summary.setAttribute('aria-expanded', isExpanded.toString());
                    });
                    
                    // Only watch for class attribute changes for performance
                    observer.observe(op, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                    
                    // WCAG 2.1.1: Add keyboard support for Enter and Space keys
                    summary.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            // Prevent default to avoid page scroll on Space
                            e.preventDefault();
                            // Trigger click to maintain consistency with mouse interaction
                            this.click();
                            
                            // WCAG 4.1.3: Announce state change to screen readers
                            const isOpen = op.classList.contains('is-open');
                            announceToScreenReader(
                                `${methodText} ${pathText} operation ${isOpen ? 'expanded' : 'collapsed'}`
                            );
                        }
                    });
                }
            }
        });
    }
    
    /**
     * Enhance buttons with descriptive ARIA labels
     * Ensures all interactive buttons are properly labeled for screen readers
     * Complies with WCAG 4.1.2 (Name, Role, Value)
     */
    function enhanceButtons() {
        // Try it out buttons - allow users to test API endpoints
        document.querySelectorAll('.try-out__btn:not([data-a11y-enhanced])').forEach(btn => {
            btn.setAttribute('data-a11y-enhanced', 'true');
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', 'Try this API operation');
            }
        });
        
        // Execute buttons
        document.querySelectorAll('.execute:not([data-a11y-enhanced])').forEach(btn => {
            btn.setAttribute('data-a11y-enhanced', 'true');
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', 'Execute API request');
            }
            
            // Announce execution
            btn.addEventListener('click', function() {
                announceToScreenReader('Executing API request, please wait...', 'assertive');
            });
        });
        
        // Clear buttons
        document.querySelectorAll('.btn-clear:not([data-a11y-enhanced])').forEach(btn => {
            btn.setAttribute('data-a11y-enhanced', 'true');
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', 'Clear');
            }
        });
    }
    
    // Enhance form inputs
    function enhanceInputs() {
        const inputs = document.querySelectorAll('.swagger-ui input:not([data-a11y-enhanced]), .swagger-ui textarea:not([data-a11y-enhanced])');
        
        inputs.forEach(input => {
            input.setAttribute('data-a11y-enhanced', 'true');
            
            // Add label if missing
            if (!input.getAttribute('aria-label') && !input.getAttribute('id')) {
                // Try to find label from nearby text
                const row = input.closest('tr');
                if (row) {
                    const label = row.querySelector('td:first-child')?.textContent.trim();
                    if (label) {
                        input.setAttribute('aria-label', label + ' parameter');
                    }
                }
            }
            
            // Add required indicator to screen readers
            if (input.hasAttribute('required')) {
                const label = input.getAttribute('aria-label') || '';
                input.setAttribute('aria-label', label + ' (required)');
            }
        });
    }
    
    // Enhance response sections
    function enhanceResponses() {
        document.querySelectorAll('.responses-wrapper:not([data-a11y-enhanced])').forEach(wrapper => {
            wrapper.setAttribute('data-a11y-enhanced', 'true');
            wrapper.setAttribute('aria-label', 'API response section');
            
            // Watch for responses
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        // Check if response was added
                        const response = wrapper.querySelector('.responses-inner');
                        if (response) {
                            const statusCode = response.querySelector('.response-col_status')?.textContent.trim();
                            if (statusCode) {
                                announceToScreenReader(`Response received with status ${statusCode}`, 'assertive');
                            }
                        }
                    }
                });
            });
            
            observer.observe(wrapper, { childList: true, subtree: true });
        });
    }
    
    // Add keyboard shortcuts
    function setupKeyboardShortcuts() {
        // Keyboard shortcuts help text constant
        const KEYBOARD_SHORTCUTS_HELP = `Keyboard Shortcuts:
- Tab: Navigate through elements
- Enter or Space: Activate buttons and expand sections
- Escape: Close expanded sections
- Alt + H: Show this help message
- Alt + /: Focus on search (if available)`;
        
        document.addEventListener('keydown', function(e) {
            // Alt + H: Show help
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                announceToScreenReader(KEYBOARD_SHORTCUTS_HELP);
                alert(KEYBOARD_SHORTCUTS_HELP);
            }
            
            // Alt + /: Focus search
            if (e.altKey && e.key === '/') {
                e.preventDefault();
                const searchInput = document.querySelector('.operation-filter-input');
                if (searchInput) {
                    searchInput.focus();
                    announceToScreenReader('Search focused');
                }
            }
            
            // Escape: Close all expanded sections
            if (e.key === 'Escape') {
                const expanded = document.querySelector('.opblock.is-open');
                if (expanded) {
                    const summary = expanded.querySelector('.opblock-summary');
                    if (summary) {
                        summary.click();
                        announceToScreenReader('Closed expanded section');
                    }
                }
            }
        });
    }
    
    // Main enhancement function
    function enhanceAccessibility() {
        enhanceOperations();
        enhanceButtons();
        enhanceInputs();
        enhanceResponses();
    }
    
    // Initialize on load
    function initialize() {
        createLiveRegion();
        setupKeyboardShortcuts();
        
        // Initial enhancement
        enhanceAccessibility();
        
        // Set up mutation observer for dynamic content
        const observer = new MutationObserver((mutations) => {
            enhanceAccessibility();
        });
        
        const swaggerUI = document.querySelector('#swagger-ui');
        if (swaggerUI) {
            observer.observe(swaggerUI, {
                childList: true,
                subtree: true
            });
        }
        
        // Announce when page is ready
        setTimeout(() => {
            announceToScreenReader('API documentation loaded. Press Alt + H for keyboard shortcuts.');
        }, 1000);
    }
    
    // Wait for Swagger UI to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // Try to initialize after a short delay to ensure Swagger UI is ready
        setTimeout(initialize, 500);
    }
})();
