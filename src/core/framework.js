
class FrameWork {
    constructor(app) {
        this.states = [];
        this.stateIndex = 0;
        this.oldDom = null
        this.app = app
        this.root = document.getElementById('app');
        this.routes = {}

    }

    useState(initialValue) {
        const currentIndex = this.stateIndex;
        const self = this;
        this.states[currentIndex] = this.states[currentIndex] ?? initialValue;

        function setState(newValue) {
            if (self.states[currentIndex] !== newValue) {
                self.states[currentIndex] = newValue;
                self.patchApp();
            }
        }
        this.stateIndex++;
        return [this.states[currentIndex], setState];
    }

    createElement(type, props, ...children) {
        return {
            type,
            props: props || {},
            children: children.map(child =>
                typeof child === "string" || typeof child === "number"
                    ? { type: "text", props: {}, children: [], content: child }
                    : child),
        };
    }
    asignRoute(route, conpemt) {
        this.routes[route] = conpemt
    }
    createRElement(vDom) {
        if (vDom === null) {
            return null;
        }

        if (vDom.type === "text") {
            const textNode = document.createTextNode(vDom.content);
            return textNode;
        }

        const element = document.createElement(vDom.type);
        const props = vDom.props || {};
        Object.keys(props).forEach(key => {
            if (key.startsWith("on") && typeof props[key] === 'function') {
                const event = key.slice(2).toLowerCase();
                element[`on${event}`] = props[key];
            } else if (key === "style" && typeof props[key] === "object") {
                Object.assign(element.style, props[key]);
            } else if (key === 'checked') {
                if (props[key]) {
                    element.setAttribute(key, "");
                } else {
                    element.removeAttribute(key)
                }
            } else if (key === "value") {
                element.value = props[key];
            } else {
                element.setAttribute(key, props[key]);
            }
        });

        const children = vDom.children.filter(e => e) || [];
        children.forEach(child => {
            element.appendChild(this.createRElement(child));
        });
        return element;
    }

    diffy = (app, container) => {
        let diffs = this.Difrence(this.oldDom, app)
        console.log(diffs);

        this.oldDom = app
        this.handleChange(container.children[0], diffs)
    }
    handleChange = (rDom, diffs = []) => {
        let parent, newNode
        for (const diff of diffs) {
            switch (diff.type) {
                case "add":
                    let idx = diff.path[diff.path.length - 1];

                    parent = this.getelEment(rDom, diff.path.slice(0, -1))
                    let vnode = this.getelEment(this.oldDom, diff.path)
                    newNode = this.createRElement(vnode)

                    if (idx >= parent.children.length) {

                        parent.appendChild(newNode)
                    } else {

                        parent.insertBefore(newNode, parent.children[idx])
                    }
                    break;
                case "remove":
                    parent = this.getelEment(rDom, diff.path.slice(0, -1));
                    const childIndex = diff.path.at(-1);
                    parent.removeChild(parent.children[childIndex]);
                    break
                case "atr":
                    let elem = this.getelEment(rDom, diff.path)
                    this.setAttribute(elem, diff.name, diff.newValue)
                    break
                case "replace":
                    const parentNode = this.getelEment(rDom, diff.path.slice(0, -1));
                    const index = diff.path.at(-1);
                    const newVNode = this.getelEment(this.oldDom, diff.path);
                    newNode = this.createRElement(newVNode);
                    const childNode = parentNode.childNodes[index];
                    if (childNode) {
                        parentNode.replaceChild(newNode, childNode);
                    }
                    break;

                default:
                    break;
            }
        }
    }
    setAttribute = (elem, atr, val) => {
        if (atr.startsWith("on") && typeof val === 'function') {
            const event = atr.slice(2).toLowerCase();
            elem[`on${event}`] = val;
        } else if (atr === "style" && typeof val === "object") {
            Object.assign(elem.style, val);
        } else if (atr === 'checked') {
            elem.checked = !!val;

            if (val) {
                elem.setAttribute(atr, "");
            } else {

                elem.removeAttribute(atr)
            }
        } else if (atr === "value") {
            elem.value = val;
        } else {
            elem.setAttribute(atr, val);
        }
    }
    Router(notFound = () => this.createElement("div", {}, "404 Not Found")) {
        const path = location.hash.slice(1) || "/";
        const Page = this.routes[path] || notFound;
        this.stateIndex = 0;
        this.app = Page;
        return Page
    }

    Difrence = (oNode, nNode, path = []) => {
        let diff = []
        if (!oNode && nNode) {
            diff.push({ type: "add", path, newValue: nNode });
            return diff;
        }
        if (oNode && !nNode) {
            diff.push({ type: "remove", path, oldValue: oNode });
            return diff;
        }
        if (oNode.type !== nNode.type) {
            diff.push({ type: "replace", path, oldValue: oNode.type, newValue: nNode.type });
            return diff;
        }
        if (oNode.type === "text") {
            if (oNode.content !== nNode.content) {
                diff.push({ type: "replace", path, oldValue: oNode.content, newValue: nNode.content });
            }
            return diff;
        }

        const allAttrs = new Set([
            ...Object.keys(oNode.props || {}),
            ...Object.keys(nNode.props || {}),
        ]);
        if (allAttrs.has('checked')) {
            console.log(oNode.props['checked'], nNode.props['checked']);

        }
        allAttrs.forEach(attr => {
            let oldVal = oNode.props?.[attr];
            let newVal = nNode.props?.[attr];
            if (attr.startsWith('on')) {
                oldVal = oldVal?.toString();
                newVal = newVal?.toString();
            }
            if (oldVal !== newVal) {
                diff.push({
                    type: "atr",
                    name: attr,
                    oldValue: oldVal,
                    newValue: newVal,
                    path
                });
            }
        });
        const oChildren = (oNode.children || []).filter(e => !!e);
        const nChildren = (nNode.children || []).filter(e => !!e);
        const maxLen = Math.max(oChildren.length, nChildren.length);
        for (let i = maxLen - 1; i >= 0; i--) {
            diff.push(...this.Difrence(oChildren[i], nChildren[i], [...path, i]));
        }

        return diff;
    };
    getelEment = (current, path) => {
        if (!current || path.length === 0) {
            return current;
        }
        const [index, ...rest] = path;
        if (!current.children || !current.children[index]) return null;
        return this.getelEment(current.children[index], rest);
    }
    render(vDom, container) {

        if (vDom === null) {
            return null;
        }

        if (vDom.type === "text") {
            const textNode = document.createTextNode(vDom.content);
            container.appendChild(textNode);
            return textNode;
        }

        const element = document.createElement(vDom.type);
        const props = vDom.props || {};
        Object.keys(props).forEach(key => {
            if (key.startsWith("on") && typeof props[key] === 'function') {
                const event = key.slice(2).toLowerCase();
                element[`on${event}`] = props[key];
            } else if (key === "style" && typeof props[key] === "object") {
                Object.assign(element.style, props[key]);
            } else if (key === 'checked') {
                if (props[key]) {
                    element.setAttribute(key, "");
                }
            } else if (key === "value") {
                element.value = props[key];
            } else {
                element.setAttribute(key, props[key]);
            }
        });

        const children = vDom.children || [];
        children.forEach(child => {
            this.render(child, element);
        });
        container.appendChild(element);
        //  return element;
    }
    patchApp() {
        this.root.innerHTML =""
        this.stateIndex = 0;
        const app = this.app()
        if (!this.oldDom) {
        //    this.oldDom = app
            this.render(app, this.root);
            return
        }
        this.diffy(app, this.root)
    }
    start() {
        this.app()
        this.patchApp()
    }
};

