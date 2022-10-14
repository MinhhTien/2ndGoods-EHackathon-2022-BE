import express from 'express';
import Config from './utils/app.config';
import { AppDataSource } from './data';
import bodyParser from 'body-parser';
const path = require('path');
import routes from './routes';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import chalk from 'chalk';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(helmet());
app.use(routes);
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
AppDataSource.initialize()
  .then(source => {
    server.listen(Config.PORT, () => {
        console.log(
            chalk.magenta.bold(
                `2ndGoods server is listening at port ${Config.PORT}!`)
        );
      server.emit('ok');
    });
  })
  .catch(err => {
    console.error(
      chalk.red('There are some errors while initialzing data source!')
    );
    console.error('Detail:');
    console.log(err);
    process.exit(1);
  });

export default server;