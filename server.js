const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve index.html
    fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading the HTML file.');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });

  } else if (req.url === '/public/css/style.css') {
    // Serve style.css
    fs.readFile(path.join(__dirname, '/public/css/style.css'), 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading the CSS file.');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });

  }  else if (req.url === '/src/app.js') {
    // Serve page.js
    fs.readFile(path.join(__dirname, 'src', 'app.js'), 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('JavaScript file not found.');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });

  } else if (req.url === '/src/core/router.js') {
    // Serve router.js
    fs.readFile(path.join(__dirname, 'src', 'core', 'router.js'), 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('JavaScript file not found.');
      }
      else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });
  } else if (req.url === '/src/core/framework.js') {
    // Serve dom.js
    fs.readFile(path.join(__dirname, 'src', 'core', 'framework.js'), 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('JavaScript file not found.');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });
  }else {
    // Not found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found.');
  }
});

const port = 3003;
const hostname = '127.0.0.1';

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
