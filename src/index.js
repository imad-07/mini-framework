// MiniDOM: Main Entry Point
import { h, createElement, mount, patch } from "../src/core/dom.js";
import { createStore } from "../src/core/state.js";
import { createRouter } from "../src/core/router.js";
import * as utils from "./utils.js";

/**
 * Creates a new MiniDOM application
 * @param {object} options - Application options
 * @returns {object} Application methods
 */
function createApp(options = {}) {
  const {
    initialState = {},
    routes = {},
    rootElement = document.body,
  } = options;

  // Create core systems
  const store = createStore(initialState);

  // State for tracking rendering
  let currentVNode = null;
  let rootNode = null;

  // Create router if routes are provided
  const router = createRouter(routes, (handler) => {
    if (handler) {
      const routeResult = handler(store.getState());
      if (routeResult) {
        renderApp(routeResult);
      }
    }
  });

  /**
   * Renders the application
   * @param {object|function} vnode - Virtual DOM node or function returning one
   */
  function renderApp(vnode) {
    const resolvedVNode =
      typeof vnode === "function" ? vnode(store.getState()) : vnode;

    if (!currentVNode) {
      // Initial render
      rootNode = mount(resolvedVNode, rootElement);
      currentVNode = resolvedVNode;
    } else {
      // Update render
      rootNode = patch(rootNode, currentVNode, resolvedVNode);
      currentVNode = resolvedVNode;
    }
  }

  // Helper for creating components
  function createComponent(renderFn, methods = {}) {
    return (props = {}, children = []) => {
      const localState = { ...props };

      const component = {
        setState(updates) {
          Object.assign(localState, updates);
          if (component.onUpdate) {
            component.onUpdate(localState);
          }
          return component;
        },
        getState() {
          return { ...localState };
        },
        ...methods,
      };

      const vnode = renderFn(localState, children, component);
      return vnode;
    };
  }

  return {
    // DOM methods
    h,
    createElement,
    mount,
    render: renderApp,

    // State management
    store,
    getState: store.getState,
    setState: store.setState,

    // Routing
    router,
    navigate: router.navigate,

    // Component factory
    createComponent,

    // Utilities
    utils,
  };
}

// Export all modules
export {
  createApp,
  h,
  createElement,
  mount,
  patch,
  createStore,
  createRouter,
  utils,
};
