/**
 * Swagger UI Accessibility Enhancements
 * This script adds ARIA attributes, keyboard navigation, and screen reader support
 * to the Swagger UI interface for improved accessibility.
 */

(function() {
    'use strict';
    
    // Create live region for screen reader announcements
    function createLiveRegion() {
        if (document.getElementById('aria-live-region')) {
            return; // Already exists
        }
        
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.insertBefore(liveRegion, document.body.firstChild);
    }
    
    // Announce message to screen readers
    function announceToScreenReader(message, priority = 'polite') {
        const liveRegion = document.getElementById('aria-live-region');
        if (!liveRegion) return;
        
        // Set priority (polite or assertive)
        liveRegion.setAttribute('aria-live', priority);
        
        // Clear and then set message (ensures it's announced)
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }
    
    // Enhance operation blocks with accessibility features
    function enhanceOperations() {
        const operations = document.querySelectorAll('.opblock:not([data-a11y-enhanced])');
        
        operations.forEach((op) => {
            // Mark as enhanced to avoid duplicate processing
            op.setAttribute('data-a11y-enhanced', 'true');
            
            const method = op.querySelector('.opblock-summary-method');
            const path = op.querySelector('.opblock-summary-path');
            const summary = op.querySelector('.opblock-summary');
            
            if (method && path) {
                const methodText = method.textContent.trim();
                const pathText = path.textContent.trim();
                
                // Set ARIA label
                op.setAttribute('aria-label', `${methodText} ${pathText} API operation`);
                
                if (summary) {
                    // Make expandable section accessible
                    summary.setAttribute('role', 'button');
                    summary.setAttribute('aria-expanded', 'false');
                    
                    if (!summary.hasAttribute('tabindex')) {
                        summary.setAttribute('tabindex', '0');
                    }
                    
                    // Track expansion state
                    const observer = new MutationObserver(() => {
                        const isExpanded = op.classList.contains('is-open');
                        summary.setAttribute('aria-expanded', isExpanded.toString());
                    });
                    
                    observer.observe(op, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                    
                    // Keyboard support
                    summary.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            this.click();
                            
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
    
    // Enhance buttons with better labels
    function enhanceButtons() {
        // Try it out buttons
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
