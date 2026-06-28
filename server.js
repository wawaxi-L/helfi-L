const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { initSocket } = require('./lib/socketServer');

const dev = process.argv.includes('--dev');
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  });

  const io = new Server(httpServer);
  initSocket(io);

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port} (${dev ? 'development' : 'production'})`);
  });
});
