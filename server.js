const express = require('express');
const bodyParser = require('body-parser');
const busboy = require('express-busboy');

const http = require('http');

const app = express();
const notifyRouter = busboy.extend(express.Router());
const port = process.env.PORT || 8080;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
app.use('/receivePaymentResultFromWalletOne', notifyRouter);

const server = http.createServer(app);
server.listen(process.env.PORT || port);

require('./Backend/queries')(app, notifyRouter);

module.exports = server;
