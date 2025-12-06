/**
 * Accessibility Helper for CLI
 * Provides screen reader support and accessible feedback for command-line operations
 */

const consola = require('consola');

/**
 * Announce a message in an accessible way
 * @param {string} message - The message to announce
 * @param {string} type - Type of message: 'success', 'error', 'info', 'warn'
 */
function announce(message, type = 'info') {
    // Remove spinner characters and ANSI codes for screen readers
    const cleanMessage = message.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    
    switch(type) {
        case 'success':
            consola.success(cleanMessage);
            break;
        case 'error':
            consola.error(cleanMessage);
            break;
        case 'warn':
            consola.warn(cleanMessage);
            break;
        case 'info':
        default:
            consola.info(cleanMessage);
            break;
    }
}

/**
 * Announce a progress update
 * @param {string} action - The action being performed
 * @param {string} status - Current status
 */
function announceProgress(action, status) {
    const message = `${action}: ${status}`;
    announce(message, 'info');
}

/**
 * Announce a list of items in an accessible way
 * @param {Array} items - Array of items to announce
 * @param {string} itemType - Type of items (e.g., "broadcast", "contact")
 */
function announceList(items, itemType = 'item') {
    const count = items.length;
    if (count === 0) {
        announce(`No ${itemType}s found`, 'info');
        return;
    }
    
    announce(`Found ${count} ${itemType}${count > 1 ? 's' : ''}`, 'info');
    
    items.forEach((item, index) => {
        const position = `${index + 1} of ${count}`;
        console.log(`${position}: ${item.name || item}`);
    });
}

/**
 * Create an accessible prompt with clear instructions
 * @param {string} question - The question to ask
 * @param {string} defaultValue - Default value if any
 * @param {boolean} required - Whether input is required
 * @returns {string} - Formatted prompt message
 */
function createAccessiblePrompt(question, defaultValue = null, required = false) {
    let prompt = question;
    
    if (defaultValue) {
        prompt += ` (default: ${defaultValue})`;
    }
    
    if (required) {
        prompt += ' (required)';
    }
    
    return prompt;
}

/**
 * Announce command completion
 * @param {string} command - The command that was executed
 * @param {boolean} success - Whether the command succeeded
 * @param {string} details - Additional details
 */
function announceCompletion(command, success, details = '') {
    const status = success ? 'completed successfully' : 'failed';
    const message = `Command ${command} ${status}${details ? ': ' + details : ''}`;
    announce(message, success ? 'success' : 'error');
}

/**
 * Format validation errors in an accessible way
 * @param {Array} errors - Array of error messages
 */
function announceValidationErrors(errors) {
    if (!errors || errors.length === 0) return;
    
    announce(`Found ${errors.length} validation error${errors.length > 1 ? 's' : ''}`, 'error');
    
    errors.forEach((error, index) => {
        console.error(`  ${index + 1}. ${error}`);
    });
}

/**
 * Announce keyboard shortcuts or help information
 * @param {Object} shortcuts - Object containing shortcut descriptions
 */
function announceKeyboardShortcuts(shortcuts) {
    announce('Available keyboard shortcuts:', 'info');
    
    Object.entries(shortcuts).forEach(([key, description]) => {
        console.log(`  ${key}: ${description}`);
    });
}

/**
 * Create a progress indicator that's accessible to screen readers
 * @param {string} action - The action being performed
 * @returns {Object} - Object with update and complete methods
 */
function createAccessibleProgress(action) {
    announce(`Starting: ${action}`, 'info');
    
    return {
        update: (status) => {
            announceProgress(action, status);
        },
        complete: (success = true, message = '') => {
            announceCompletion(action, success, message);
        }
    };
}

/**
 * Format table data in an accessible way for screen readers
 * @param {Array} rows - Array of row objects
 * @param {Array} columns - Array of column names
 */
function announceTable(rows, columns) {
    if (!rows || rows.length === 0) {
        announce('No data to display', 'info');
        return;
    }
    
    announce(`Table with ${rows.length} row${rows.length > 1 ? 's' : ''} and ${columns.length} column${columns.length > 1 ? 's' : ''}`, 'info');
    
    // Announce column headers
    console.log('\nColumns: ' + columns.join(', '));
    
    // Announce each row
    rows.forEach((row, index) => {
        console.log(`\nRow ${index + 1}:`);
        columns.forEach(col => {
            console.log(`  ${col}: ${row[col]}`);
        });
    });
}

/**
 * Provide accessible confirmation prompt feedback
 * @param {string} action - The action requiring confirmation
 * @param {boolean} destructive - Whether the action is destructive
 */
function announceConfirmationPrompt(action, destructive = false) {
    const warning = destructive ? ' (Warning: This action cannot be undone)' : '';
    announce(`Confirmation required for: ${action}${warning}`, 'warn');
}

/**
 * Enhanced spinner with screen reader announcements
 * @param {string} message - Message to display
 * @param {Function} operation - Async operation to perform
 */
async function accessibleSpinner(message, operation) {
    const Spinner = require('cli-spinner').Spinner;
    
    // Announce start for screen readers
    announce(message, 'info');
    
    const spinner = new Spinner(message + ' %s');
    spinner.setSpinnerString(29);
    spinner.start();
    
    try {
        const result = await operation();
        spinner.stop(true);
        announce('Operation completed', 'success');
        return result;
    } catch (error) {
        spinner.stop(true);
        announce('Operation failed: ' + error.message, 'error');
        throw error;
    }
}

module.exports = {
    announce,
    announceProgress,
    announceList,
    createAccessiblePrompt,
    announceCompletion,
    announceValidationErrors,
    announceKeyboardShortcuts,
    createAccessibleProgress,
    announceTable,
    announceConfirmationPrompt,
    accessibleSpinner
};
