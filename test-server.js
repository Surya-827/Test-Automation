const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.TEST_SERVER_PORT || 3000;
const fixturesDir = path.join(__dirname, 'src', 'fixtures');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css'
};

const server = http.createServer((req, res) => {
  const rawPath = req.url || '/';
  const cleanPath = rawPath.split('?')[0].split('#')[0];
  let filePath = path.join(fixturesDir, cleanPath === '/' ? 'index.html' : cleanPath);
  if (!path.extname(filePath)) filePath += '.html';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found: ' + filePath);
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'text/plain' });
    res.end(data);
  });
});

module.exports = {
  start: () => new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) return reject(err);
      console.log(`[Server] Listening on http://localhost:${port}`);
      resolve(server);
    });
  }),
  stop: () => new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      console.log('[Server] Stopped');
      resolve();
    });
  }),
  url: () => `http://localhost:${port}`
};
