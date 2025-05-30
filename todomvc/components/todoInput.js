// TodoInput Component
import { h } from "../../src/index.js";

/**
 * Creates a TodoInput component
 * @param {object} app - MiniDOM app instance
 * @returns {function} TodoInput component function
 */
export function createTodoInput(app) {
  return app.createComponent((props) => {
    return h("header", { class: "header" }, [
      h("h1", {}, ["todos"]),
      h("input", {
        class: "new-todo",
        placeholder: "What needs to be done?",
        autofocus: !props.editing,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            const value = e.target.value.trim();
            if (value) {
              props.onAdd(value);
              e.target.value = "";
            }
          }
        },
      }),
    ]);
  });
}
