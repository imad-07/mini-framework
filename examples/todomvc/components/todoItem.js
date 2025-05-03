// TodoItem Component
import { h } from "../../../src/index.js";

/**
 * Creates a TodoItem component
 * @param {object} app - MiniDOM app instance
 * @returns {function} TodoItem component function
 */
export function createTodoItem(app) {
  return app.createComponent(
    (props, children, component) => {
      // State for tracking edit mode
      const isEditing = props.editing || false;

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
      };

      if (props.completed) {
        checkboxAttrs.checked = true;
      }

      return h("li", { class: className, "data-id": props.id }, [
        // View mode
        h("div", { class: "view" }, [
          h("input", checkboxAttrs),
          h(
            "label",
            {
              onDblClick: () => {
                console.log(123)
                component.setState({ editing: true });
                // Focus the edit field after rendering
                setTimeout(() => {
                  const editInput = document.querySelector(
                    `li[data-id="${props.id}"] .edit`
                  );
                  if (editInput) {
                    editInput.focus();
                    editInput.selectionStart = editInput.value.length;
                  }
                }, 10);
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
          onBlur: (e) => {
            const newText = e.target.value.trim();
            if (newText) {
              props.onEdit(props.id, newText);
            } else {
              props.onRemove(props.id);
            }
            component.setState({ editing: false });
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
    },
    {
      onUpdate: (state) => {
        if (state.editing) {
          // Focus the edit field when entering edit mode
          const editInput = document.querySelector(
            `li[data-id="${state.id}"] .edit`
          );
          if (editInput) {
            editInput.parentElement.classList.add("editing")
            editInput.focus();
            
          }
          document.onkeydown = (e =>{
            if (e.key === "Enter") {
              editInput.parentElement.classList.remove("editing")
            }
          })
          document.onclick = (e =>{
            if (e.target != editInput.parentElement) {
              editInput.parentElement.classList.remove("editing")
            }
          })
        }
      },
    }
  );
}
