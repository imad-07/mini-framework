import { createElement, Difrence, getelEment, render } from "./dom.js";

// Define an element object
let vApp = {
  tag: "div",
  attrs: { id: "app" },
  children: [
    {
      tag: "h1",
      attrs: {},
      children: [{ tag: "text", attrs: { text: "Hello World" }, children: [] }],
    },
  ],
};
let App = {
  tag: "div",
  attrs: { id: "app" },
  children: [
    {
      tag: "h1",
      attrs: { id: "o" },
      children: [{ tag: "text", attrs: { text: "Hello World" }, children: [] }],
    },
  ],
};


render(document.body, App)
document.onclick = () => {
  render(document.body, vApp)
} 
