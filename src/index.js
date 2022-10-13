const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const cors = require('cors');
const helmet = require('helmet');
const chalk = require('chalk');
const http = require('http');
const port = process.env.PORT || '3000';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(helmet());
app.use(routes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

const server = http.createServer(app);
server.listen(config.APPLICATION_PORT, () => {
    console.log(
        chalk.magenta.bold(
            `2ndGoods server is listening at port ${port}!`)
    );
    server.emit('ok');
})

module.exports = server;