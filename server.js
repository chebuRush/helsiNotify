const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const notify = require('./Backend/notify');

const app = express();
const port = process.env.PORT || 8090;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));

const server = http.createServer(app);
server.listen(process.env.PORT || port);

require('./Backend/queries')(app);

try{
    notify()
}catch (e){
    console.error('server notify Error')
}
module.exports = server;
