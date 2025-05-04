const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    // Serve index.html
    fs.readFile(
      path.join(__dirname, "todomvc/index.html"),
      "utf-8",
      (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error loading the HTML file.");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      }
    );
  } else if (req.url === "/todomvc/styles.css") {
    // Serve style.css
    fs.readFile(
      path.join(__dirname, "/todomvc/styles.css"),
      "utf-8",
      (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error loading the CSS file.");
        } else {
          res.writeHead(200, { "Content-Type": "text/css" });
          res.end(data);
        }
      }
    );
  } else if (req.url === "/todomvc/app.js") {
    // Serve page.js
    fs.readFile(
      path.join(__dirname, "todomvc", "app.js"),
      "utf-8",
      (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("JavaScript file not found.");
        } else {
          res.writeHead(200, { "Content-Type": "application/javascript" });
          res.end(data);
        }
      }
    );
  } else if (req.url.startsWith("/todomvc/components/")) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Component file not found.");
      } else {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(data);
      }
    });
  } else if (req.url.startsWith("/src/")) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Component file not found.");
      } else {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(data);
      }
    });
  } else {
    // Not found
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found.");
  }
});

const port = 3003;
const hostname = "127.0.0.1";

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
