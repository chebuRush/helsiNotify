const express = require('express');
const busboyBodyParser = require('busboy-body-parser');
const busboy = require('express-busboy');

const http = require('http');

const app = express();
const notifyRouter = busboy.extend(app);
const port = process.env.PORT || 8080;

app.use(busboyBodyParser({ limit: '50mb' }));
app.use(express.static(`${__dirname}/public`));

const server = http.createServer(app);
server.listen(process.env.PORT || port);

require('./Backend/queries')(app);

module.exports = server;
