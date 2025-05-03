// TodoList Component
import { h } from "../../../src/index.js";
import { createTodoItem } from "./todoItem.js";

/**
 * Creates a TodoList component
 * @param {object} app - MiniDOM app instance
 * @returns {function} TodoList component function
 */
export function createTodoList(app) {
  const TodoItem = createTodoItem(app);

  return app.createComponent((props) => {
    const { todos, filter, onToggle, onRemove, onEdit } = props;

    // Filter todos based on current filter
    const filteredTodos = todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true; // 'all' filter
    });

    // If no todos match the filter, return empty list with proper class
    if (filteredTodos.length === 0) {
      return h("ul", { class: "todo-list" }, []);
    }

    // Render todo items
    return h(
      "ul",
      { class: "todo-list" },
      filteredTodos.map((todo) =>
        TodoItem({
          id: todo.id,
          text: todo.text,
          completed: todo.completed,
          onToggle,
          onRemove,
          onEdit,
        })
      )
    );
  });
}
