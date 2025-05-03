// TodoMVC Application using MiniDOM Framework
import { createApp, h } from "../../src/index.js";
import { createTodoInput } from "./components/todoInput.js";
import { createTodoList } from "./components/todoList.js";
import { uniqueId } from "../../src/utils.js";

// Define routes
const routes = {
  "/": () => renderApp("all"),
  "/active": () => renderApp("active"),
  "/completed": () => renderApp("completed"),
};

// Initialize the app with initial state
const app = createApp({
  initialState: {
    todos: loadTodos(),
    filter: "all", // 'all', 'active', 'completed'
  },
  routes,
  rootElement: document.getElementById("app"),
});

// Load todos from localStorage
function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem("minidom-todos")) || [];
  } catch (e) {
    console.error("Failed to load todos from localStorage:", e);
    return [];
  }
}

// Save todos to localStorage
function saveTodos(todos) {
  localStorage.setItem("minidom-todos", JSON.stringify(todos));
}

// // Create components
const TodoInput = createTodoInput(app);
const TodoList = createTodoList(app);

// Event handlers
function addTodo(text) {
  app.setState((state) => {
    const newTodos = [
      ...state.todos,
      { id: uniqueId(), text, completed: false },
    ];
    saveTodos(newTodos);
    return { todos: newTodos };
  });
}

function toggleTodo(id) {
  app.setState((state) => {
    const newTodos = state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(newTodos);
    return { todos: newTodos };
  });
}

function removeTodo(id) {
  app.setState((state) => {
    const newTodos = state.todos.filter((todo) => todo.id !== id);
    saveTodos(newTodos);
    return { todos: newTodos };
  });
}

function editTodo(id, text) {
  app.setState((state) => {
    const newTodos = state.todos.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    );
    saveTodos(newTodos);
    return { todos: newTodos };
  });
}

function toggleAll(completed) {
  app.setState((state) => {
    const newTodos = state.todos.map((todo) => ({ ...todo, completed }));
    saveTodos(newTodos);
    return { todos: newTodos };
  });
}

function clearCompleted() {
  app.setState((state) => {
    const newTodos = state.todos.filter((todo) => !todo.completed);
    saveTodos(newTodos);
    return { todos: newTodos };
  });
}

function setFilter(filter) {
  app.setState({ filter });
}

// Create router
const router = app.router;

// Main render function
function renderApp(filter) {
  if (filter) {
    app.setState({ filter });
  }

  const state = app.getState();
  const { todos } = state;

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  const allCompleted = todos.length > 0 && activeTodoCount === 0;

  // Main app view
  app.render(
    h("section", { class: "todoapp" }, [
      // Input for new todos
      TodoInput({ onAdd: addTodo }),

      // Main section (only visible when there are todos)
      todos.length > 0
        ? h("section", { class: "main" }, [
            h("input", {
              id: "toggle-all",
              class: "toggle-all",
              type: "checkbox",
              checked: allCompleted,
              onClick: () => toggleAll(!allCompleted),
            }),
            h("label", { for: "toggle-all" }, ["Mark all as complete"]),

            // Todo list
            TodoList({
              todos,
              filter: state.filter,
              onToggle: toggleTodo,
              onRemove: removeTodo,
              onEdit: editTodo,
            }),
          ])
        : null,

      // Footer (only visible when there are todos)
      todos.length > 0
        ? h("footer", { class: "footer" }, [
            // Todo count
            h("span", { class: "todo-count" }, [
              h("strong", {}, [activeTodoCount.toString()]),
              ` item${activeTodoCount !== 1 ? "s" : ""} left`,
            ]),

            // Filters
            h("ul", { class: "filters" }, [
              h("li", {}, [
                h(
                  "a",
                  {
                    href: "#/",
                    class: state.filter === "all" ? "selected" : "",
                    onClick: (e) => {
                      e.preventDefault();
                      router.navigate("/");
                    },
                  },
                  ["All"]
                ),
              ]),
              h("li", {}, [
                h(
                  "a",
                  {
                    href: "#/active",
                    class: state.filter === "active" ? "selected" : "",
                    onClick: (e) => {
                      e.preventDefault();
                      router.navigate("/active");
                    },
                  },
                  ["Active"]
                ),
              ]),
              h("li", {}, [
                h(
                  "a",
                  {
                    href: "#/completed",
                    class: state.filter === "completed" ? "selected" : "",
                    onClick: (e) => {
                      e.preventDefault();
                      router.navigate("/completed");
                    },
                  },
                  ["Completed"]
                ),
              ]),
            ]),

            // Clear completed button (only visible when there are completed todos)
            completedCount > 0
              ? h(
                  "button",
                  {
                    class: "clear-completed",
                    onClick: clearCompleted,
                  },
                  ["Clear completed"]
                )
              : {},
          ])
        : {},
    ])
  );
}

// Initialize the app
router.navigate(
  window.location.pathname === "/" ? "/" : window.location.pathname
);

// Listen for route changes
window.addEventListener("popstate", () => {
  router.navigate(window.location.pathname, false);
});

const myApp = (state) => {
  const { todos } = state;

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  const allCompleted = todos.length > 0 && activeTodoCount === 0;

  return h("section", { class: "todoapp" }, [
    // Input for new todos
    TodoInput({ onAdd: addTodo }),

    // Main section (only visible when there are todos)
    todos.length > 0
      ? h("section", { class: "main" }, [
          h("input", {
            id: "toggle-all",
            class: "toggle-all",
            type: "checkbox",
            checked: allCompleted,
            onClick: () => toggleAll(!allCompleted),
          }),
          h("label", { for: "toggle-all" }, ["Mark all as complete"]),

          // Todo list
          TodoList({
            todos,
            filter: state.filter,
            onToggle: toggleTodo,
            onRemove: removeTodo,
            onEdit: editTodo,
          }),
        ])
      : null,

    // Footer (only visible when there are todos)
    todos.length > 0
      ? h("footer", { class: "footer" }, [
          // Todo count
          h("span", { class: "todo-count" }, [
            h("strong", {}, [activeTodoCount.toString()]),
            ` item${activeTodoCount !== 1 ? "s" : ""} left`,
          ]),

          // Filters
          h("ul", { class: "filters" }, [
            h("li", {}, [
              h(
                "a",
                {
                  href: "#/",
                  class: state.filter === "all" ? "selected" : "",
                  onClick: (e) => {
                    e.preventDefault();
                    router.navigate("/");
                  },
                },
                ["All"]
              ),
            ]),
            h("li", {}, [
              h(
                "a",
                {
                  href: "#/active",
                  class: state.filter === "active" ? "selected" : "",
                  onClick: (e) => {
                    e.preventDefault();
                    router.navigate("/active");
                  },
                },
                ["Active"]
              ),
            ]),
            h("li", {}, [
              h(
                "a",
                {
                  href: "#/completed",
                  class: state.filter === "completed" ? "selected" : "",
                  onClick: (e) => {
                    e.preventDefault();
                    router.navigate("/completed");
                  },
                },
                ["Completed"]
              ),
            ]),
          ]),

          // Clear completed button (only visible when there are completed todos)
          completedCount > 0
            ? h(
                "button",
                {
                  class: "clear-completed",
                  onClick: clearCompleted,
                },
                ["Clear completed"]
              )
            : null,
        ])
      : null,
  ]);
};

app.store.subscribe(() => {
  app.render(myApp);
});

app.render(myApp);

// renderApp();
