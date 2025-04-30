
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
        this.states[currentIndex] ??= initialValue;

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
        this.root.innerHTML = ""
        this.stateIndex = 0;
        const app = this.app()
        this.render(app, this.root);
    }
    start() {
        this.app()
        let self = this
        document.onDOMContentLoaded = () => {
            document.body.onclick = (e) => {

                if (e.target.matches('[data-link]')) {
                    e.preventDefault();
                    const href = e.target.getAttribute('href');
                    self.app = self.routes[href]
                }
            };
        }

        this.patchApp()
    }
};

