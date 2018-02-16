const express = require('express');
const bodyParser = require('body-parser');
const busboy = require('express-busboy');

const http = require('http');

const app = express();
const notifyRouter = busboy.extend(app);
const port = process.env.PORT || 8080;

function unless(path, middleware) {
    return function inner(req, res, next) {
        if (path === req.path) {
            return next();
        }
        return middleware(req, res, next);
    };
}

app.use(notifyRouter);
app.use(express.static(`${__dirname}/public`));

const server = http.createServer(app);
server.listen(process.env.PORT || port);

require('./Backend/queries')(app, notifyRouter);

module.exports = server;
