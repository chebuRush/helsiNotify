const express = require('express');
const notifyModule = require('./Backend/notify/');
const busboy = require('express-busboy');

const http = require('http');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(`${__dirname}/public`));
busboy.extend(app);

const server = http.createServer(app);
server.listen(process.env.PORT || port);

require('./Backend/queries')(app);

try {
    notifyModule();
} catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Notify Module ERROR: ${e.message}`);
}

module.exports = server;
