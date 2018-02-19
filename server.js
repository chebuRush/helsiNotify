const express = require('express');
const notifyModule = require('./Backend/notify/');
const busboy = require('express-busboy');
const https = require('https');
const http = require('http');
const memwatch = require('memwatch-next');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(`${__dirname}/public`));
busboy.extend(app);

const server = http.createServer(app);
server.listen(process.env.PORT || port);

require('./Backend/queries')(app);

memwatch.on('leak', info => {
    console.error(`Memory leak detected | ${new Date()}:\n`, info);
});

try {
    notifyModule();
} catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Notify Module ERROR: ${e.message}`);
}

setInterval(() => {
    https.get('https://helsi-notify.herokuapp.com');
}, 1000000);

module.exports = server;
