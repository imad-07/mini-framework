# MiniDOM Framework Documentation

MiniDOM is a lightweight JavaScript framework for building modern web applications. It provides a simple yet powerful API for DOM manipulation, state management, routing, and event handling.

## Table of Contents

1. [Installation](#installation)
2. [Core Concepts](#core-concepts)
3. [API Reference](#api-reference)
   - [DOM Manipulation](#dom-manipulation)
   - [State Management](#state-management)
   - [Routing](#routing)
   - [Event Handling](#event-handling)
4. [Examples](#examples)
5. [Best Practices](#best-practices)

## Installation

Include the MiniDOM framework in your project:

```html
<script type="module">
  import { createApp } from './src/index.js';
  
  // Your application code here
</script>
```

## Core Concepts

MiniDOM is built around four core concepts:

1. **Virtual DOM**: A lightweight representation of the real DOM, making updates efficient.
2. **State Management**: A predictable state container for your application.
3. **Routing**: Simple URL-based navigation for single-page applications.
4. **Event System**: Custom event handling separate from the DOM.

## API Reference

### DOM Manipulation

#### Creating Elements

MiniDOM uses a function called `h()` (hyperscript) to create virtual DOM elements:

```javascript
import { h } from './src/index.js';

// Create a simple div
const div = h('div', { class: 'container' }, [
  'Hello, World!'
]);

// Create a nested structure
const app = h('div', { class: 'app' }, [
  h('header', {}, [
    h('h1', {}, ['My App'])
  ]),
  h('main', {}, [
    h('p', {}, ['Welcome to my application!'])
  ])
]);
```

#### Mounting Elements

To render a virtual DOM tree to the real DOM:

```javascript
import { mount } from './src/index.js';

const vnode = h('div', {}, ['Hello, World!']);
mount(vnode, document.getElementById('app'));
```

#### Adding Attributes

Attributes are specified as an object in the second parameter of `h()`:

```javascript
h('input', {
  type: 'text',
  placeholder: 'Enter your name',
  value: 'John',
  class: 'input-field',
  style: {
    color: 'blue',
    fontSize: '16px'
  },
  onClick: () => console.log('Clicked!')
});
```

#### Nesting Elements

Child elements are passed as an array in the third parameter of `h()`:

```javascript
h('ul', { class: 'list' }, [
  h('li', {}, ['Item 1']),
  h('li', {}, ['Item 2']),
  h('li', {}, ['Item 3'])
]);
```

### State Management

#### Creating a Store

The store is the single source of truth for your application state:

```javascript
import { createStore } from './src/index.js';

const store = createStore({
  todos: [],
  filter: 'all'
});
```

#### Getting State

```javascript
const state = store.getState();
console.log(state.todos);
```

#### Updating State

```javascript
// Update with an object
store.setState({
  filter: 'active'
});

// Update with a function
store.setState(prevState => ({
  todos: [...prevState.todos, { id: 1, text: 'New Todo', completed: false }]
}));
```

#### Subscribing to Changes

```javascript
const unsubscribe = store.subscribe(state => {
  console.log('State changed:', state);
  renderApp();
});

// Later, to unsubscribe
unsubscribe();
```

#### Connecting Components to State

```javascript
store.connect(
  // Selector function
  state => state.todos.filter(todo => todo.completed),
  // Change handler
  completedTodos => {
    console.log('Completed todos changed:', completedTodos);
  }
);
```

### Routing

#### Creating a Router

```javascript
import { createRouter } from './src/index.js';

const router = createRouter({
  '/': ()