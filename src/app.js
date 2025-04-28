const frameWork = new FrameWork(() => frameWork.Router());let holder
function TodoApp() {
    const [todos, setTodos] = frameWork.useState([]);
    const [filter, setFilter] = frameWork.useState("all");
    const [editingID, setEditingID] = frameWork.useState(null);
    holder = todos
    function toggleTodo(id) {
        setTodos(holder.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed, checked: "true" };
            }
            return todo;
        }));
    }

    function addTodo(e,) {
        let newTodo = e.target.value;
        if (newTodo.trim() === "") {
            return;
        }
        e.target.value = ""
        setTodos([...holder, { id: Date.now(), text: newTodo, completed: false }]);
    }

    function saveTodo(id, e) {
        let newText = e.target.value;
        if (newText.trim() === "") {
            setTodos(holder.filter(todo => todo.id !== id));
        } else {
            setTodos(holder.map(todo =>
                todo.id === id ? { ...todo, text: newText } : todo
            ));
        }
        setEditingID(null);
    }

    const filteredTodos = holder.filter(todo => {
        if (filter === "active") {
            return !todo.completed;
        }
        if (filter === "completed") {
            return todo.completed;
        }
        return true;
    })
    let section = {
        type: "section",
        props: {
            class: "todoapp",
            id: "root"
        },
        children: [
            {
                type: "header",
                props: {
                    class: "header",
                    "data-testid": "header"
                },
                children: [
                    {
                        type: "h1",
                        props: {},
                        children: [
                            { type: "text", content: "todos" }
                        ]
                    },
                    {
                        type: "div",
                        props: {
                            class: "input-container"
                        },
                        children: [
                            {
                                type: "input",
                                props: {
                                    class: "new-todo",
                                    id: "todo-input",
                                    type: "text",
                                    "data-testid": "text-input",
                                    placeholder: "What needs to be done?",

                                    onkeydown: (e) => {
                                        if (e.key === "Enter") {

                                            addTodo(e);
                                        }
                                    }
                                },
                                children: []
                            },
                            {
                                type: "label",
                                props: {
                                    class: "visually-hidden",
                                    for: "todo-input"
                                },
                                children: []
                            }
                        ]
                    }
                ]
            }]
    }
    if (holder.length !== 0) {
        let footer = {
            type: "footer",
            props: {
                class: "footer",
                "data-testid": "footer"
            },
            children: [
                {
                    type: "span",
                    props: {
                        class: "todo-count"
                    },
                    children: [{
                        type: "text",
                        content: `${holder.filter(todo => !todo.completed).length} ${holder.filter(todo => !todo.completed).length === 1 ? 'item' : 'items'} left!`
                    }]
                },
                {
                    type: "ul",
                    props: {
                        class: "filters",
                        "data-testid": "footer-navigation"
                    },
                    children: [
                        {
                            type: "li",
                            props: {},
                            children: [
                                {
                                    type: "a",
                                    props: {
                                        class: filter === "all" ? "selected" : "",
                                        href: "#/",
                                        onclick: () => {
                                            setFilter("all")
                                        }
                                    },
                                    children: [
                                        { type: "text", content: "All" }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "li",
                            props: {},
                            children: [
                                {
                                    type: "a",
                                    props: {
                                        class: filter === "active" ? "selected" : "",
                                        href: "#/active",
                                        onclick: () => {
                                            setFilter("active")
                                        }
                                    },
                                    children: [
                                        { type: "text", content: "Active" }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "li",
                            props: {},
                            children: [
                                {
                                    type: "a",
                                    props: {
                                        class: filter === "completed" ? "selected" : "",
                                        href: "#/completed",
                                        onclick: () => {
                                            setFilter("completed")
                                        }
                                    },
                                    children: [
                                        { type: "text", content: "Completed" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "button",
                    props: {
                        class: "clear-completed",
                        onclick: () => {
                            setTodos(holder.filter(todo => !todo.completed));
                        }
                    },
                    children: [
                        { type: "text", content: "Clear completed" }
                    ]
                }
            ]
        }
        let main = {
            type: "main",
            props: {
                class: "main",
                "data-testid": "main"
            },
            children: [
                {
                    type: "div",
                    props: {
                        class: "toggle-all-container"
                    },
                    children: [
                        {
                            type: "input",
                            props: {
                                class: "toggle-all",
                                type: "checkbox",
                                id: "toggle-all",
                                "data-testid": "toggle-all",
                                checked: holder.length > 0 && holder.every(todo => todo.completed),
                                onclick: () => {
                                    setTodos(holder.map(todo => ({ ...todo, completed: !holder.every(t => t.completed) })));
                                }
                            },
                            children: []
                        },
                        {
                            type: "label",
                            props: {
                                class: "toggle-all-label",
                                for: "toggle-all"
                            },
                            children: [{ type: "text", content: "Toggle All Input" }]
                        }
                    ]
                },
                {
                    type: "ul",
                    props: {
                        class: "todo-list",
                        "data-testid": "todo-list"
                    },
                    children: filteredTodos.map(todo => ({
                        type: "li",
                        props: {
                            class: `${todo.completed ? "completed" : ""} ${editingID === todo.id ? "editing" : ""}`,
                            "data-testid": "todo-item"
                        },
                        children: [
                            {
                                type: "div",
                                props: {
                                    class: "view"
                                },
                                children: [
                                    {
                                        type: "input",
                                        props: {
                                            class: "toggle",
                                            type: "checkbox",
                                            id: `todo-${todo.id}`,
                                            "data-testid": "todo-item-toggle",
                                            checked: todo.completed,
                                            onchange: () => {
                                                toggleTodo(todo.id);
                                            }
                                        },
                                        children: []
                                    },
                                    {
                                        type: "label",
                                        props: {
                                            class: "todo-label",
                                            "data-testid": "todo-item-label",
                                            ondblclick: (e) => {
                                                setEditingID(todo.id);
                                                document.querySelector('.edit')?.focus();
                                            }
                                        },
                                        children: [
                                            { type: "text", content: todo.text }
                                        ]
                                    },
                                    {
                                        type: "button",
                                        props: {
                                            class: "destroy",
                                            "data-testid": "todo-item-button",
                                            onclick: () => {
                                                setTodos(holder.filter(t => t.id !== todo.id));
                                            }
                                        },
                                        children: []
                                    }
                                ]
                            },
                            editingID !== todo.id ? null : {
                                type: "input",
                                props: {
                                    class: "edit",
                                    type: "text",
                                    value: todo.text,
                                    onblur: (e) => {
                                        saveTodo(todo.id, e);
                                    },
                                    onkeydown: (e) => {
                                        if (e.key === "Escape") {
                                            setEditingID(null);
                                        }
                                        if (e.key === "Enter") {
                                            e.target.blur();
                                        }
                                    },
                                    autofocus: true
                                },
                                children: []
                            }
                        ]
                    }))
                }
            ]
        }
        section.children.push(main, footer)
    }

    return section

}
function TodoAppActive() {
    const [todos, setTodos] = frameWork.useState([]);
    const [filter, setFilter] = frameWork.useState("active");
    const [editingID, setEditingID] = frameWork.useState(null);
    holder = todos
    function toggleTodo(id) {
        setTodos(holder.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed, checked: "true" };
            }
            return todo;
        }));
    }

    function addTodo(e,) {
        let newTodo = e.target.value;
        if (newTodo.trim() === "") {
            return;
        }
        e.target.value = ""
        setTodos([...holder, { id: Date.now(), text: newTodo, completed: false }]);
    }

    function saveTodo(id, e) {
        let newText = e.target.value;
        if (newText.trim() === "") {
            setTodos(holder.filter(todo => todo.id !== id));
        } else {
            setTodos(holder.map(todo =>
                todo.id === id ? { ...todo, text: newText } : todo
            ));
        }
        setEditingID(null);
    }

    const filteredTodos = holder.filter(todo => {
        if (filter === "active") {
            return !todo.completed;
        }
        if (filter === "completed") {
            return todo.completed;
        }
        return true;
    })
    let section = {
        type: "section",
        props: {
            class: "todoapp",
            id: "root"
        },
        children: [
            {
                type: "header",
                props: {
                    class: "header",
                    "data-testid": "header"
                },
                children: [
                    {
                        type: "h1",
                        props: {},
                        children: [
                            { type: "text", content: "todos" }
                        ]
                    },
                    {
                        type: "div",
                        props: {
                            class: "input-container"
                        },
                        children: [
                            {
                                type: "input",
                                props: {
                                    class: "new-todo",
                                    id: "todo-input",
                                    type: "text",
                                    "data-testid": "text-input",
                                    placeholder: "What needs to be done?",

                                    onkeydown: (e) => {
                                        if (e.key === "Enter") {

                                            addTodo(e);
                                        }
                                    }
                                },
                                children: []
                            },
                            {
                                type: "label",
                                props: {
                                    class: "visually-hidden",
                                    for: "todo-input"
                                },
                                children: []
                            }
                        ]
                    }
                ]
            }]
    }
    if (holder.length !== 0) {
        let footer = {
            type: "footer",
            props: {
                class: "footer",
                "data-testid": "footer"
            },
            children: [
                {
                    type: "span",
                    props: {
                        class: "todo-count"
                    },
                    children: [{
                        type: "text",
                        content: `${holder.filter(todo => !todo.completed).length} ${holder.filter(todo => !todo.completed).length === 1 ? 'item' : 'items'} left!`
                    }]
                },
                {
                    type: "ul",
                    props: {
                        class: "filters",
                        "data-testid": "footer-navigation"
                    },
                    children: [
                        {
                            type: "li",
                            props: {},
                            children: [
                                {
                                    type: "a",
                                    props: {
                                        class: filter === "all" ? "selected" : "",
                                        href: "#/",
                                        onclick: () => {
                                            setFilter("all")
                                        }
                                    },
                                    children: [
                                        { type: "text", content: "All" }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "li",
                            props: {},
                            children: [
                                {
                                    type: "a",
                                    props: {
                                        class: filter === "active" ? "selected" : "",
                                        href: "#/active",
                                        onclick: () => {
                                            setFilter("active")
                                        }
                                    },
                                    children: [
                                        { type: "text", content: "Active" }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "li",
                            props: {},
                            children: [
                                {
                                    type: "a",
                                    props: {
                                        class: filter === "completed" ? "selected" : "",
                                        href: "#/completed",
                                        onclick: () => {
                                            setFilter("completed")
                                        }
                                    },
                                    children: [
                                        { type: "text", content: "Completed" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "button",
                    props: {
                        class: "clear-completed",
                        onclick: () => {
                            setTodos(holder.filter(todo => !todo.completed));
                        }
                    },
                    children: [
                        { type: "text", content: "Clear completed" }
                    ]
                }
            ]
        }
        let main = {
            type: "main",
            props: {
                class: "main",
                "data-testid": "main"
            },
            children: [
                {
                    type: "div",
                    props: {
                        class: "toggle-all-container"
                    },
                    children: [
                        {
                            type: "input",
                            props: {
                                class: "toggle-all",
                                type: "checkbox",
                                id: "toggle-all",
                                "data-testid": "toggle-all",
                                checked: holder.length > 0 && holder.every(todo => todo.completed),
                                onclick: () => {
                                    setTodos(holder.map(todo => ({ ...todo, completed: !holder.every(t => t.completed) })));
                                }
                            },
                            children: []
                        },
                        {
                            type: "label",
                            props: {
                                class: "toggle-all-label",
                                for: "toggle-all"
                            },
                            children: [{ type: "text", content: "Toggle All Input" }]
                        }
                    ]
                },
                {
                    type: "ul",
                    props: {
                        class: "todo-list",
                        "data-testid": "todo-list"
                    },
                    children: filteredTodos.map(todo => ({
                        type: "li",
                        props: {
                            class: `${todo.completed ? "completed" : ""} ${editingID === todo.id ? "editing" : ""}`,
                            "data-testid": "todo-item"
                        },
                        children: [
                            {
                                type: "div",
                                props: {
                                    class: "view"
                                },
                                children: [
                                    {
                                        type: "input",
                                        props: {
                                            class: "toggle",
                                            type: "checkbox",
                                            id: `todo-${todo.id}`,
                                            "data-testid": "todo-item-toggle",
                                            checked: todo.completed,
                                            onchange: () => {
                                                toggleTodo(todo.id);
                                            }
                                        },
                                        children: []
                                    },
                                    {
                                        type: "label",
                                        props: {
                                            class: "todo-label",
                                            "data-testid": "todo-item-label",
                                            ondblclick: (e) => {
                                                setEditingID(todo.id);
                                                document.querySelector('.edit')?.focus();
                                            }
                                        },
                                        children: [
                                            { type: "text", content: todo.text }
                                        ]
                                    },
                                    {
                                        type: "button",
                                        props: {
                                            class: "destroy",
                                            "data-testid": "todo-item-button",
                                            onclick: () => {
                                                setTodos(holder.filter(t => t.id !== todo.id));
                                            }
                                        },
                                        children: []
                                    }
                                ]
                            },
                            editingID !== todo.id ? null : {
                                type: "input",
                                props: {
                                    class: "edit",
                                    type: "text",
                                    value: todo.text,
                                    onblur: (e) => {
                                        saveTodo(todo.id, e);
                                    },
                                    onkeydown: (e) => {
                                        if (e.key === "Escape") {
                                            setEditingID(null);
                                        }
                                        if (e.key === "Enter") {
                                            e.target.blur();
                                        }
                                    },
                                    autofocus: true
                                },
                                children: []
                            }
                        ]
                    }))
                }
            ]
        }
        section.children.push(main, footer)
    }

    return section

}
function TodoAppcompleted() {
    const [todos, setTodos] = frameWork.useState([]);
    const [filter, setFilter] = frameWork.useState("completed");
    const [editingID, setEditingID] = frameWork.useState(null);
    holder = todos
    function toggleTodo(id) {
        setTodos(holder.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed, checked: "true" };
            }
            return todo;
        }));
    }

    function addTodo(e,) {
        let newTodo = e.target.value;
        if (newTodo.trim() === "") {
            return;
        }
        e.target.value = ""
        setTodos([...holder, { id: Date.now(), text: newTodo, completed: false }]);
    }

    function saveTodo(id, e) {
        let newText = e.target.value;
        if (newText.trim() === "") {
            setTodos(holder.filter(todo => todo.id !== id));
        } else {
            setTodos(holder.map(todo =>
                todo.id === id ? { ...todo, text: newText } : todo
            ));
        }
        setEditingID(null);
    }

    const filteredTodos = holder.filter(todo => {
        if (filter === "active") {
            return !todo.completed;
        }
        if (filter === "completed") {
            return todo.completed;
        }
        return true;
    })
    let section = {
        type: "section",
        props: {
            class: "todoapp",
            id: "root"
        },
        children: [
            {
                type: "header",
                props: {
                    class: "header",
                    "data-testid": "header"
                },
                children: [
                    {
                        type: "h1",
                        props: {},
                        children: [
                            { type: "text", content: "todos" }
                        ]
                    },
                    {
                        type: "div",
                        props: {
                            class: "input-container"
                        },
                        children: [
                            {
                                type: "input",
                                props: {
                                    class: "new-todo",
                                    id: "todo-input",
                                    type: "text",
                                    "data-testid": "text-input",
                                    placeholder: "What needs to be done?",

                                    onkeydown: (e) => {
                                        if (e.key === "Enter") {

                                            addTodo(e);
                                        }
                                    }
                                },
                                children: []
                            },
                            {
                                type: "label",
                                props: {
                                    class: "visually-hidden",
                                    for: "todo-input"
                                },
                                children: []
                            }
                        ]
                    }
                ]
            }]
    }
    if (holder.length !== 0) {
        let footer = {
            type: "footer",
            props: {
                class: "footer",
                "data-testid": "footer"
            },
            children: [
                {
                    type: "span",
                    props: {
                        class: "todo-count"
                    },
                    children: [{
                        type: "text",
                        content: `${holder.filter(todo => !todo.completed).length} ${holder.filter(todo => !todo.completed).length === 1 ? 'item' : 'items'} left!`
                    }]
                },
                {
                    type: "ul",
                    props: {
                        class: "filters",
                        "data-testid": "footer-navigation"
                    },
                    children: [
                        {
                            type: "li",
                            props: {},
                            children: [
                                {
                                    type: "a",
                                    props: {
                                        class: filter === "all" ? "selected" : "",
                                        href: "#/",
                                        onclick: () => {
                                            setFilter("all")
                                        }
                                    },
                                    children: [
                                        { type: "text", content: "All" }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "li",
                            props: {},
                            children: [
                                {
                                    type: "a",
                                    props: {
                                        class: filter === "active" ? "selected" : "",
                                        href: "#/active",
                                        onclick: () => {
                                            setFilter("active")
                                        }
                                    },
                                    children: [
                                        { type: "text", content: "Active" }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "li",
                            props: {},
                            children: [
                                {
                                    type: "a",
                                    props: {
                                        class: filter === "completed" ? "selected" : "",
                                        href: "#/completed",
                                        onclick: () => {
                                            setFilter("completed")
                                        }
                                    },
                                    children: [
                                        { type: "text", content: "Completed" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "button",
                    props: {
                        class: "clear-completed",
                        onclick: () => {
                            setTodos(holder.filter(todo => !todo.completed));
                        }
                    },
                    children: [
                        { type: "text", content: "Clear completed" }
                    ]
                }
            ]
        }
        let main = {
            type: "main",
            props: {
                class: "main",
                "data-testid": "main"
            },
            children: [
                {
                    type: "div",
                    props: {
                        class: "toggle-all-container"
                    },
                    children: [
                        {
                            type: "input",
                            props: {
                                class: "toggle-all",
                                type: "checkbox",
                                id: "toggle-all",
                                "data-testid": "toggle-all",
                                checked: holder.length > 0 && holder.every(todo => todo.completed),
                                onclick: () => {
                                    setTodos(holder.map(todo => ({ ...todo, completed: !holder.every(t => t.completed) })));
                                }
                            },
                            children: []
                        },
                        {
                            type: "label",
                            props: {
                                class: "toggle-all-label",
                                for: "toggle-all"
                            },
                            children: [{ type: "text", content: "Toggle All Input" }]
                        }
                    ]
                },
                {
                    type: "ul",
                    props: {
                        class: "todo-list",
                        "data-testid": "todo-list"
                    },
                    children: filteredTodos.map(todo => ({
                        type: "li",
                        props: {
                            class: `${todo.completed ? "completed" : ""} ${editingID === todo.id ? "editing" : ""}`,
                            "data-testid": "todo-item"
                        },
                        children: [
                            {
                                type: "div",
                                props: {
                                    class: "view"
                                },
                                children: [
                                    {
                                        type: "input",
                                        props: {
                                            class: "toggle",
                                            type: "checkbox",
                                            id: `todo-${todo.id}`,
                                            "data-testid": "todo-item-toggle",
                                            checked: todo.completed,
                                            onchange: () => {
                                                toggleTodo(todo.id);
                                            }
                                        },
                                        children: []
                                    },
                                    {
                                        type: "label",
                                        props: {
                                            class: "todo-label",
                                            "data-testid": "todo-item-label",
                                            ondblclick: (e) => {
                                                setEditingID(todo.id);
                                                document.querySelector('.edit')?.focus();
                                            }
                                        },
                                        children: [
                                            { type: "text", content: todo.text }
                                        ]
                                    },
                                    {
                                        type: "button",
                                        props: {
                                            class: "destroy",
                                            "data-testid": "todo-item-button",
                                            onclick: () => {
                                                setTodos(holder.filter(t => t.id !== todo.id));
                                            }
                                        },
                                        children: []
                                    }
                                ]
                            },
                            editingID !== todo.id ? null : {
                                type: "input",
                                props: {
                                    class: "edit",
                                    type: "text",
                                    value: todo.text,
                                    onblur: (e) => {
                                        saveTodo(todo.id, e);
                                    },
                                    onkeydown: (e) => {
                                        if (e.key === "Escape") {
                                            setEditingID(null);
                                        }
                                        if (e.key === "Enter") {
                                            e.target.blur();
                                        }
                                    },
                                    autofocus: true
                                },
                                children: []
                            }
                        ]
                    }))
                }
            ]
        }
        section.children.push(main, footer)
    }

    return section

}
frameWork.asignRoute("/", TodoApp);
frameWork.asignRoute("/active", TodoAppActive);
frameWork.asignRoute("/completed", TodoAppcompleted);

window.addEventListener("hashchange", () => {frameWork.Router()
    frameWork.patchApp();

});
frameWork.start();
