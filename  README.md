# Mini-FrameWork Documentation

## Introduction
FrameWork is a lightweight, reactive JavaScript library for building user interfaces. It provides a simple API for creating and updating DOM elements, managing component state, and handling user interactions. This document will guide you through the features and usage of FrameWork.

## Core Features
- Virtual DOM implementation
- State management with `useState` hook
- Event handling
- Element creation and nesting
- Automatic re-rendering on state changes
- Client-side routing

## Getting Started

### Basic Setup
To start using FrameWork, include the library in your project and create a root element in your HTML:

```html
<div id="app"></div>
```

Then define your application component and initialize it:

```javascript
function App() {
  return createElement('div', null, 'Hello, FrameWork!');
}

// Initialize the application
patchApp();
```

## API Reference

### createElement(type, props, ...children)
Creates a virtual DOM element.

- `type`: String representing the HTML tag (e.g., 'div', 'button')
- `props`: Object containing element attributes and event handlers
- `...children`: Child elements or text content

**Example - Creating a simple element:**
```javascript
function App() {
  return createElement('div', { class: 'container' }, 'Hello World');
}
```

**Example - Nesting elements:**
```javascript
function App() {
  return createElement('div', { class: 'container' },
    createElement('h1', null, 'Title'),
    createElement('p', null, 'Paragraph content')
  );
}
```

### useState(initialValue)
Creates a stateful value and a function to update it.

- `initialValue`: The initial state value
- Returns: Array containing the current state value and a setter function

**Example - Using state:**
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  return createElement('div', null,
    createElement('p', null, `Count: ${count}`),
    createElement('button', { 
      onClick: () => setCount(count + 1) 
    }, 'Increment')
  );
}
```

## Working with Elements

### Adding Attributes
Pass attributes as key-value pairs in the props object:

```javascript
createElement('div', { 
  id: 'main',
  class: 'container',
  'data-value': 'custom'
}, 'Content');
```

### Styling Elements
Apply styles by passing a style object:

```javascript
createElement('div', { 
  style: {
    color: 'red',
    backgroundColor: 'black',
    padding: '10px'
  }
}, 'Styled Content');
```

### Handling Events
Event handlers are added by prefixing the event name with "on" (camelCase):

```javascript
createElement('button', {
  onClick: () => alert('Button clicked!')
}, 'Click Me');
```

**Common events:**
- `onClick`
- `onInput`
- `onChange`
- `onSubmit`
- `onKeyDown`
- `onMouseOver`

## Client-Side Routing

FrameWork includes a simple yet powerful client-side routing system that enables you to build single-page applications with multiple views.

### Router(routes)
Renders the component associated with the current URL path.

- `routes`: An object mapping URL paths to route configuration objects that contain component functions
- Returns: The rendered component for the current path

**Example - Setting up routes:**
```javascript
// page.js
export const routes = {
  '/': {
    component: HomePage
  },
  '/about': {
    component: AboutPage
  },
  '/contact': {
    component: ContactPage
  },
  '/404': {
    component: NotFoundPage
  }
};
```

```javascript
// app.js
import { Router } from './framework.js';
import { routes } from './page.js';

function App() {
  return Router(routes);
}
```

### navigateTo(href)
Programmatically navigates to a new URL without reloading the page.

- `href`: The URL path to navigate to

**Example - Programmatic navigation:**
```javascript
import { navigateTo } from './framework.js';

function NavButton() {
  return createElement('button', {
    onClick: () => navigateTo('/about')
  }, 'Go to About');
}
```

### Creating Navigation Links
To create links that work with the router, add the `data-link` attribute:

```javascript
function Nav() {
  return createElement('nav', null,
    createElement('a', { href: '/', 'data-link': true }, 'Home'),
    createElement('a', { href: '/about', 'data-link': true }, 'About'),
    createElement('a', { href: '/contact', 'data-link': true }, 'Contact')
  );
}
```

### How Routing Works
1. When a user clicks on a link with the `data-link` attribute, the default behavior is prevented
2. The URL is updated using History API without a page reload
3. The router renders the component associated with the new URL
4. Browser back/forward navigation is supported through the `popstate` event

### Complete Routing Example

```javascript
// page.js
function HomePage() {
  return createElement('div', null,
    createElement('h1', null, 'Home Page'),
    createElement('p', null, 'Welcome to our application!')
  );
}

function AboutPage() {
  return createElement('div', null,
    createElement('h1', null, 'About Us'),
    createElement('p', null, 'We are a small team passionate about web development.')
  );
}

function NotFoundPage() {
  return createElement('div', null,
    createElement('h1', null, '404 - Page Not Found'),
    createElement('p', null, 'The page you are looking for does not exist.')
  );
}

export const routes = {
  '/': {
    component: HomePage
  },
  '/about': {
    component: AboutPage
  },
  '/404': {
    component: NotFoundPage
  }
};

// app.js
import { createElement, patchApp } from './framework.js';
import { Router, navigateTo } from './router.js';
import { routes } from './page.js';

function Navigation() {
  return createElement('nav', null,
    createElement('a', { href: '/', 'data-link': true }, 'Home'),
    createElement('a', { href: '/about', 'data-link': true }, 'About')
  );
}

function App() {
  return createElement('div', { class: 'app' },
    createElement(Navigation),
    createElement('main', null, Router(routes))
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#app');
  patchApp(App(), container);
});
```

## How FrameWork Works Under the Hood

### Virtual DOM
FrameWork uses a virtual DOM approach, representing the UI as a lightweight JavaScript object tree. This approach allows for efficient updates by only rendering the parts of the UI that have changed.

### State Management
The `useState` hook maintains component state and triggers re-renders when the state changes:

1. When `useState` is called, it creates or retrieves a state value from the global state array
2. When the state setter function is called with a new value, it updates the state and triggers a re-render
3. The `patchApp` function resets the state index counter and re-renders the entire application

### Element Rendering
The `render` function takes virtual DOM elements and converts them to actual DOM nodes:

1. For text nodes, it creates a text node directly
2. For element nodes, it creates the appropriate DOM element
3. It applies all props (attributes, event handlers, styles) to the element
4. It recursively renders all children and appends them to the parent element

### Event Handling
Event handlers are attached directly to DOM elements when they're rendered, using the browser's native event system.

### Routing
The routing system uses the browser's History API to enable navigation without page reloads:

1. The `Router` function checks the current URL path and renders the corresponding component
2. When a link with `data-link` attribute is clicked, the default behavior is prevented
3. The URL is updated with `history.pushState` and the application re-renders
4. The browser's back/forward navigation is supported through the `popstate` event listener

## Best Practices

1. **Keep components small and focused** - Break your UI into smaller, reusable components
2. **Avoid direct DOM manipulation** - Let FrameWork handle all DOM updates
3. **Use state sparingly** - Only use state for values that change and affect the UI
4. **Cache event handlers** - For better performance, avoid creating new function instances on every render
5. **Organize routes logically** - Group related routes and keep route definitions in a separate file

## Limitations

- Re-renders the entire application on any state change
- Doesn't support component lifecycle methods
- No built-in context or props drilling solution
- No optimized reconciliation algorithm for large lists
- Basic routing system without nested routes or route parameters
