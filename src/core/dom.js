// MiniDOM: DOM Abstraction Module

/**
 * Creates a virtual DOM element
 * @param {string} tag - The HTML tag
 * @param {object} attrs - The element attributes
 * @param {array} children - Child elements or text
 * @returns {object} Virtual DOM node
 */
function h(tag, attrs = {}, children = []) {
  return {
    tag,
    attrs,
    children: children.map((child) =>
      typeof child === "string" || typeof child === "number"
        ? { text: String(child) }
        : child
    ),
  };
}

/**
 * Renders a virtual DOM element to a real DOM element
 * @param {object} vnode - Virtual DOM node
 * @returns {HTMLElement} Real DOM element
 */
function createElement(vnode) {
  // Handle text nodes

  if (vnode.text !== undefined) {
    return document.createTextNode(vnode.text);
  }

  // Create the element
  const element = document.createElement(vnode.tag);

  // Add attributes
  Object.entries(vnode.attrs || {}).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      // Handle event attributes (like onClick)
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === "style" && typeof value === "object") {
      // Handle style objects
      Object.entries(value).forEach(([prop, val]) => {
        element.style[prop] = val;
      });
    } else {
      // Handle regular attributes
      element.setAttribute(key, value);
    }
  });

  // Append children
  (vnode.children || []).forEach((child) => {
    if (child) {
      element.appendChild(createElement(child));
    }
  });

  return element;
}

/**
 * Mounts a virtual DOM tree to a real DOM element
 * @param {object} vnode - Virtual DOM tree
 * @param {HTMLElement} container - Container element
 */
function mount(vnode, container) {
  container.innerHTML = "";
  const element = createElement(vnode);
  container.appendChild(element);
  return element;
}

/**
 * Updates a DOM element by comparing virtual nodes
 * @param {HTMLElement} element - The real DOM element
 * @param {object} oldVNode - Previous virtual node
 * @param {object} newVNode - New virtual node
 * @returns {HTMLElement} Updated DOM element
 */
function patch(element, oldVNode, newVNode) {
  // If node types are different, replace completely
  if (oldVNode.tag !== newVNode.tag) {
    const newElement = createElement(newVNode);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
  }

  // Text node handling
  if (newVNode.text !== undefined) {
    if (element.nodeValue !== newVNode.text) {
      element.nodeValue = newVNode.text;
    }
    return element;
  }

  // Update attributes
  const oldAttrs = oldVNode.attrs || {};
  const newAttrs = newVNode.attrs || {};

  // Add/update new attributes
  Object.entries(newAttrs).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      // Handle event attributes
      const eventName = key.slice(2).toLowerCase();
      if (oldAttrs[key] !== value) {
        if (oldAttrs[key]) {
          element.removeEventListener(eventName, oldAttrs[key]);
        }
        element.addEventListener(eventName, value);
      }
    } else if (key === "style" && typeof value === "object") {
      // Handle style objects
      const oldStyle = oldAttrs.style || {};
      Object.entries(value).forEach(([prop, val]) => {
        if (oldStyle[prop] !== val) {
          element.style[prop] = val;
        }
      });
      // Remove old styles
      Object.keys(oldStyle).forEach((prop) => {
        if (!(prop in value)) {
          element.style[prop] = "";
        }
      });
    } else if (oldAttrs[key] !== value) {
      // Update regular attributes
      element.setAttribute(key, value);
    }
  });

  // Remove old attributes that are no longer present
  Object.keys(oldAttrs).forEach((key) => {
    if (!(key in newAttrs)) {
      if (key.startsWith("on")) {
        const eventName = key.slice(2).toLowerCase();
        element.removeEventListener(eventName, oldAttrs[key]);
      } else {
        element.removeAttribute(key);
      }
    }
  });

  // Update children
  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];
  const max = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < max; i++) {
    if (i >= newChildren.length) {
      // Remove excess children
      element.removeChild(element.childNodes[i]);
    } else if (i >= oldChildren.length) {
      // Add new children
      element.appendChild(createElement(newChildren[i]));
    } else {
      // Update existing children
      patch(element.childNodes[i], oldChildren[i], newChildren[i]);
    }
  }

  return element;
}

export { h, createElement, mount, patch };
