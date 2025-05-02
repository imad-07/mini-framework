// MiniDOM: Custom Event System

/**
 * Creates a custom event emitter
 * @returns {object} Event emitter methods
 */
function createEventEmitter() {
    const events = new Map();
    
    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event
     * @param {function} handler - Event handler
     * @returns {function} Unsubscribe function
     */
    function on(eventName, handler) {
      if (!events.has(eventName)) {
        events.set(eventName, new Set());
      }
      
      events.get(eventName).add(handler);
      
      // Return unsubscribe function
      return () => {
        const handlers = events.get(eventName);
        if (handlers) {
          handlers.delete(handler);
          if (handlers.size === 0) {
            events.delete(eventName);
          }
        }
      };
    }
    
    /**
     * Subscribe to an event once
     * @param {string} eventName - Name of the event
     * @param {function} handler - Event handler
     * @returns {function} Unsubscribe function
     */
    function once(eventName, handler) {
      const wrapper = (...args) => {
        off(eventName, wrapper);
        handler(...args);
      };
      
      return on(eventName, wrapper);
    }
    
    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event
     * @param {function} handler - Event handler
     */
    function off(eventName, handler) {
      const handlers = events.get(eventName);
      if (handlers) {
        if (handler) {
          handlers.delete(handler);
          if (handlers.size === 0) {
            events.delete(eventName);
          }
        } else {
          events.delete(eventName);
        }
      }
    }
    
    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {...any} args - Arguments to pass to handlers
     */
    function emit(eventName, ...args) {
      const handlers = events.get(eventName);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(...args);
          } catch (error) {
            console.error(`Error in event handler for "${eventName}":`, error);
          }
        });
      }
    }
    
    return {
      on,
      once,
      off,
      emit
    };
  }
  
  /**
   * Creates a custom event system for DOM elements
   * @param {HTMLElement} element - DOM element to attach events to
   * @returns {object} Event methods
   */
  function createDomEvents(element) {
    const listeners = new Map();
    
    /**
     * Adds an event listener
     * @param {string} eventName - The event name
     * @param {function} handler - Event handler
     * @param {object} options - Event options
     * @returns {function} Cleanup function
     */
    function addEvent(eventName, handler, options = {}) {
      // Create a wrapper that supports event delegation
      const wrapper = options.delegate
        ? e => {
            const target = e.target;
            if (target.matches(options.delegate)) {
              handler(e, target);
            }
          }
        : handler;
      
      element.addEventListener(eventName, wrapper, options);
      
      // Store the listener to be able to remove it later
      if (!listeners.has(eventName)) {
        listeners.set(eventName, new Map());
      }
      
      listeners.get(eventName).set(handler, wrapper);
      
      // Return cleanup function
      return () => {
        removeEvent(eventName, handler);
      };
    }
    
    /**
     * Removes an event listener
     * @param {string} eventName - The event name
     * @param {function} handler - Event handler to remove
     */
    function removeEvent(eventName, handler) {
      const eventMap = listeners.get(eventName);
      if (eventMap && eventMap.has(handler)) {
        const wrapper = eventMap.get(handler);
        element.removeEventListener(eventName, wrapper);
        eventMap.delete(handler);
        
        if (eventMap.size === 0) {
          listeners.delete(eventName);
        }
      }
    }
    
    /**
     * Triggers an event programmatically
     * @param {string} eventName - The event name
     * @param {object} detail - Event detail
     */
    function triggerEvent(eventName, detail = {}) {
      const event = new CustomEvent(eventName, { 
        bubbles: true, 
        cancelable: true, 
        detail 
      });
      
      element.dispatchEvent(event);
    }
    
    return {
      on: addEvent,
      off: removeEvent,
      trigger: triggerEvent
    };
  }
  
  export { createEventEmitter, createDomEvents };