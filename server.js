const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const port = process.env.PORT || 8090;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));

const server = http.createServer(app);
server.listen(process.env.PORT || port);

require('./Backend/queries')(app);

module.exports = server;
