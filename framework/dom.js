// DOM abstraction here (createElement)
export function createElement(vel) {
    let rel = document.createElement(vel.tag)
    for (let atr in vel.attrs) {
        setAttribute(rel, atr, vel.attrs[atr])
    }
    vel.children?.forEach(child => {
        rel.appendChild(createElement(child))
    });
    return rel
}
export function createVNode(tag, attrs, children) {
    return { tag: tag, attrs: attrs, children: children.map((child) => createVNode(child.tag, child.attrs, child.children)) };
}
let vDom = null
export const render = (container, newDom) => {
    if (!vDom) {
        vDom = newDom
        container.appendChild(createElement(vDom))
        return
    }
    let diffs = Difrence(vDom, newDom)
    console.log(diffs);
    
    handleChange(vDom,diffs)
    vDom = newDom
}
const handleChange = (vDom, diffs = []) => {
    let rDom = document.querySelector('#app')
    for (const diff of diffs) {
        switch (diff.type) {
            case "add":
                let idx = diff.path.slice(-1)
                let parent = getelEment(rDom, diff.path.slice(0, -1))
                let newNode = createElement(getelEment(vDom, diff.path))
                if (idx >= parent.children.length) {
                    parent.appendChild(newNode)
                } else {
                    parent.insertBefore(newNode, parent.children[idx])
                }
                break;
            case "remove":
                rDom.remove(getelEment(rDom, diff.path))
                break
            case "atr":
                console.log(diff);
                
                setAttribute(getelEment(rDom, diff.path), diff.name, diff.newValue)
                break
            case "replace":
                getelEment(rDom, diff.path).replaceWith(createElement(getelEment(vDom, diff.path)))
                break
            default:
                break;
        }
    }
}
const setAttribute = (elem, atr, val) => {
    if (!val) {
        elem.removeAttribute(atr)
        return
    }
    if (atr === "text") {
        elem.textContent += val
        return
    } else if (atr.slice(0, 2) === 'on') {
        elem[atr] = (e) => val(e)
        return
    }
    elem.setAttribute(atr, val)

}
export const Difrence = (oNode, nNode, path = []) => {
    let diff = [];

    if (!oNode && nNode) {
        diff.push({ type: "add", path, newValue: nNode });
        return diff;
    }

    if (oNode && !nNode) {
        diff.push({ type: "remove", path, oldValue: oNode });
        return diff;
    }
    if (oNode.tag !== nNode.tag) {
        diff.push({ type: "replace", path, oldValue: oNode.tag, newValue: nNode.tag });
    }

    // Attribute differences
    const allAttrs = new Set([...Object.keys(oNode.attrs || {}), ...Object.keys(nNode.attrs || {})]);
    allAttrs.forEach(attr => {
        const oldVal = oNode.attrs?.[attr];
        const newVal = nNode.attrs?.[attr];
        if (oldVal !== newVal) {
            diff.push({ type: "atr", name: attr, oldValue: oldVal, newValue: newVal, path });
        }
    });

    // Children
    const maxLen = Math.max(oNode.children?.length || 0, nNode.children?.length || 0);
    for (let i = 0; i < maxLen; i++) {
        diff.push(...Difrence(oNode.children?.[i], nNode.children?.[i], [...path, i]));
    }

    return diff;
}
export const getelEment = (current, path) => {
    if (path.length === 0) {
        return current
    }
    return getelEment(current.children[path[0]], path.slice(1))
}