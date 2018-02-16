const express = require('express');
const bodyParser = require('body-parser');
const busboy = require('express-busboy');

const http = require('http');

const app = express();
const notifyRouter = busboy.extend(app);
const port = process.env.PORT || 8080;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const server = http.createServer(app);
server.listen(process.env.PORT || port);

require('./Backend/queries')(app, notifyRouter);

module.exports = server;
