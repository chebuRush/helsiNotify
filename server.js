const express = require('express');
// const bodyParser = require('body-parser');
const busboy = require('express-busboy');

const http = require('http');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(`${__dirname}/public`));
busboy.extend(app);

const server = http.createServer(app);
server.listen(process.env.PORT || port);

require('./Backend/queries')(app);

module.exports = server;
