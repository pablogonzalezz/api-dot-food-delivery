const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const port = require('./settings').port;

server.listen(port, () => {
    console.log(`[App running on port ${port}]`);
});
