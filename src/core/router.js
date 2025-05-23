// MiniDOM: Router Module

/**
 * Creates a router for single-page applications
 * @param {object} routes - Route definitions mapping paths to handlers
 * @param {function} onRouteChange - Callback for route changes
 * @returns {object} Router methods
 */
function createRouter(routes = {}, onRouteChange = () => {}) {
  // The current route path
  let currentPath = window.location.pathname;

  /**
   * Navigates to a new route
   * @param {string} path - The path to navigate to
   * @param {boolean} pushState - Whether to push a new history state
   */
  function navigate(path, pushState = true) {
    if (path === currentPath) return;

    currentPath = path;

    if (pushState) {
      window.history.pushState(null, "", path);
    }

    updateRoute();
  }

  /**
   * Updates the current route based on the path
   */
  function updateRoute() {
    // Find matching route and extract parameters
    const matchedRoute = findMatchingRoute(currentPath);

    if (matchedRoute) {
      const { handler } = matchedRoute;
      onRouteChange(handler);
    } else {
      // Handle 404 - route not found
      onRouteChange(routes["*"] || (() => {}));
    }
  }

  /**
   * Finds a matching route for the given path
   * @param {string} path - The current path
   * @returns {object|null} Matched route info or null
   */
  function findMatchingRoute(path) {
    // First try exact matches
    if (routes[path]) {
      return { handler: routes[path] };
    }

    return null;
  }

  // Set up event listeners for browser navigation
  window.addEventListener("popstate", () => {
    currentPath = window.location.pathname;
    updateRoute();
  });
  window.addEventListener(`DOMContentLoaded`, () => {
    currentPath = window.location.pathname;
    updateRoute();
  });

  // Initialize route on creation

  return {
    navigate,
    updateRoute,
  };
}

export { createRouter };
