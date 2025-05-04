// MiniDOM: State Management Module

/**
 * Creates a reactive state store
 * @param {object} initialState - The initial state
 * @returns {object} Store methods
 */
function createStore(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();

  /**
   * Returns the current state
   * @returns {object} Current state
   */
  function getState() {
    return { ...state };
  }

  /**
   * Updates the state
   * @param {object|function} update - State update or updater function
   */
  function setState(update) {
    const newState =
      typeof update === "function" ? {...state, ...update(state)} : { ...state, ...update };

    const changed = Object.keys(newState).some(
      (key) => state[key] !== newState[key]
    );

    if (changed) {
      state = newState;
      notifyListeners();
    }
  }

  /**
   * Notifies all listeners about state changes
   */
  function notifyListeners() {
    listeners.forEach((listener) => listener(state));
  }

  /**
   * Subscribes to state changes
   * @param {function} listener - Callback function
   * @returns {function} Unsubscribe function
   */
  function subscribe(listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  return {
    getState,
    setState,
    subscribe,
  };
}

export { createStore };
