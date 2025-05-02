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
    
    // Route parameters extracted from path
    let params = {};
    
    /**
     * Navigates to a new route
     * @param {string} path - The path to navigate to
     * @param {boolean} pushState - Whether to push a new history state
     */
    function navigate(path, pushState = true) {
      if (path === currentPath) return;
      
      currentPath = path;
      
      if (pushState) {
        window.history.pushState(null, '', path);
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
        const { handler, params: routeParams } = matchedRoute;
        params = routeParams;
        onRouteChange(currentPath, params, handler);
      } else {
        // Handle 404 - route not found
        onRouteChange(currentPath, {}, routes['*'] || (() => {}));
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
        return { handler: routes[path], params: {} };
      }
      
      // Then try parameterized routes
      for (const routePath in routes) {
        // Skip the exact match we already checked and catch-all route
        if (routePath === path || routePath === '*') continue;
        
        const routeSegments = routePath.split('/');
        const pathSegments = path.split('/');
        
        // Skip if segment counts don't match
        if (routeSegments.length !== pathSegments.length) continue;
        
        let isMatch = true;
        const params = {};
        
        for (let i = 0; i < routeSegments.length; i++) {
          const routeSegment = routeSegments[i];
          const pathSegment = pathSegments[i];
          
          // Check if this is a parameter segment
          if (routeSegment.startsWith(':')) {
            const paramName = routeSegment.slice(1);
            params[paramName] = pathSegment;
          } else if (routeSegment !== pathSegment) {
            isMatch = false;
            break;
          }
        }
        
        if (isMatch) {
          return { handler: routes[routePath], params };
        }
      }
      
      return null;
    }
    
    /**
     * Gets the current route parameters
     * @returns {object} Route parameters
     */
    function getParams() {
      return { ...params };
    }
    
    /**
     * Gets the current path
     * @returns {string} Current path
     */
    function getPath() {
      return currentPath;
    }
    
    // Set up event listeners for browser navigation
    window.addEventListener('popstate', () => {
      currentPath = window.location.pathname;
      updateRoute();
    });
    
    // Initialize route on creation
    updateRoute();
    
    return {
      navigate,
      getParams,
      getPath,
      updateRoute
    };
  }
  
  export { createRouter };