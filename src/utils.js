// MiniDOM: Utility Functions

/**
 * Creates a unique ID
 * @returns {string} Unique ID
 */
function uniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

export { uniqueId };
