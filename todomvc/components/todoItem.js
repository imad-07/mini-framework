// TodoItem Component
import { h } from "../../src/index.js";

/**
 * Creates a TodoItem component
 * @param {object} app - MiniDOM app instance
 * @returns {function} TodoItem component function
 */
export function createTodoItem(app) {
  return app.createComponent((props, children, component) => {
    // State for tracking edit mode
    const { editing } = app.store.getState();
    const isEditing = editing === props.id;

    // Create class string based on todo status
    const className = [
      props.completed ? "completed" : "",
      isEditing ? "editing" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const checkboxAttrs = {
      class: "toggle",
      type: "checkbox",
      onClick: () => props.onToggle(props.id),
      checked: props.completed,
    };

    return h("li", { class: className, "data-id": props.id }, [
      // View mode
      h("div", { class: "view" }, [
        h("input", checkboxAttrs),
        h(
          "label",
          {
            onDblClick: () => {
              app.store.setState({ editing: props.id });
            },
          },
          [props.text]
        ),
        h("button", {
          class: "destroy",
          onClick: () => props.onRemove(props.id),
        }),
      ]),

      // Edit mode
      h("input", {
        class: "edit",
        type: "text",
        value: props.text,
        autofocus: editing === props.id, // Need To check
        onBlur: (e) => {
          const newText = e.target.value.trim();
          if (newText) {
            props.onEdit(props.id, newText);
          } else {
            props.onRemove(props.id);
          }
          app.store.setState({ editing: false });
        },
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.target.blur();
          } else if (e.key === "Escape") {
            e.target.value = props.text;
            e.target.blur();
          }
        },
      }),
    ]);
  });
}
