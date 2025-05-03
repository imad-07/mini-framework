// MiniDOM: Main Entry Point

import { h, createElement, mount, patch } from "../src/core/dom.js";
import { createStore } from "../src/core/state.js";
import { createRouter } from "../src/core/router.js";
import { createEventEmitter, createDomEvents } from "../src/core/events.js";
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
  const events = createEventEmitter();
  const domEvents = createDomEvents(rootElement);

  // State for tracking rendering
  let currentVNode = null;
  let rootNode = null;

  // Create router if routes are provided
  const router = createRouter(routes, (path, params, handler) => {
    if (handler) {
      const routeResult = handler(params, store.getState());
      if (routeResult) {
        renderApp(routeResult);
      }
    }

    // Notify about route change
    events.emit("routeChange", { path, params });
  });

  /**
   * Renders the application
   * @param {object|function} vnode - Virtual DOM node or function returning one
   */
  function renderApp(vnode) {
    const resolvedVNode =
      typeof vnode === "function"
        ? vnode(store.getState(), router.getParams())
        : vnode;

    if (!currentVNode) {
      // Initial render
      rootNode = mount(resolvedVNode, rootElement);
      currentVNode = resolvedVNode;
    } else {
      // Update render
      rootNode = patch(rootNode, currentVNode, resolvedVNode);
      currentVNode = resolvedVNode;
    }

    events.emit("render", resolvedVNode);
  }

  // Set up state change subscription
  store.subscribe(() => {
    if (currentVNode && typeof options.view === "function") {
      renderApp(options.view);
    }
  });

  // Helper for creating components
  function createComponent(renderFn, methods = {}) {
    return (props = {}, children = []) => {
      const localState = { ...props };

      const component = {
        setState(updates) {
          console.log({ updates });
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

  // Initialize app if view is provided
  if (options.view) {
    renderApp(options.view);
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

    // Events
    events,
    domEvents,

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
  createEventEmitter,
  createDomEvents,
  utils,
};
