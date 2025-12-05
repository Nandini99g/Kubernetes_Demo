// app.js
const http = require('http');
const os = require('os');

const port = process.env.PORT || 3000;
const version = process.env.APP_VERSION || 'v1';

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/sleep')) {
    // simulate slow request: /sleep?ms=500
    const url = new URL(req.url, `http://${req.headers.host}`);
    const ms = parseInt(url.searchParams.get('ms') || '0', 10);
    setTimeout(() => {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({
        message: `Slept ${ms}ms`,
        pod: process.env.HOSTNAME || os.hostname(),
        version
      }));
    }, Math.max(0, ms));
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
    return;
  }

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    message: 'Hello from simple-k8s-app',
    pod: process.env.HOSTNAME || os.hostname(),
    version
  }));
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}, version=${version}`);
});
