// MiniDOM: Utility Functions

/**
 * Debounces a function
 * @param {function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function} Debounced function
 */
function debounce(fn, delay = 300) {
    let timeout;
    
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  
  /**
   * Throttles a function
   * @param {function} fn - Function to throttle
   * @param {number} limit - Throttle limit in milliseconds
   * @returns {function} Throttled function
   */
  function throttle(fn, limit = 300) {
    let inThrottle;
    
    return function(...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
  
  /**
   * Performs a shallow comparison of two objects
   * @param {object} obj1 - First object
   * @param {object} obj2 - Second object
   * @returns {boolean} Whether objects are equal
   */
  function shallowEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    
    if (
      typeof obj1 !== 'object' || 
      obj1 === null || 
      typeof obj2 !== 'object' || 
      obj2 === null
    ) {
      return false;
    }
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => 
      obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
    );
  }
  
  /**
   * Creates a unique ID
   * @returns {string} Unique ID
   */
  function uniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  /**
   * Simple template string interpolation
   * @param {string} template - Template string with {{var}} placeholders
   * @param {object} data - Data object
   * @returns {string} Interpolated string
   */
  function interpolate(template, data) {
    return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      const value = key.split('.').reduce((obj, k) => obj && obj[k], data);
      return value !== undefined ? value : '';
    });
  }
  
  export {
    debounce,
    throttle,
    shallowEqual,
    uniqueId,
    interpolate
  };