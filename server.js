const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const port = process.env.DB_PORT || require('./settings').port;

server.listen(port, () => {
    console.log(`[App running on port ${port}]`);
});
