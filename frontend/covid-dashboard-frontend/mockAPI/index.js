const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));

const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.bodyParser);

// Simulate some delay on each request, you can tune this by changing delayMillisecs
const delayMillisecs = 30;
server.use((req, res, next) => setTimeout(next, delayMillisecs));

server.use(router);

const port = 3009;
server.listen(port, () => {
  console.log(`JSON Server running on port ${port}`);
});