import express from 'express';
import Config from './utils/app.config';
import { AppDataSource } from './data';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './routes';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import chalk from 'chalk';
import { Server } from "socket.io";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(routes);
app.use(express.static('public/uploads'));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:8080",
    credentials: true,
  }
});
io.on("connect", (socket: any) => {
  // Say Hi to all connected clients
  io.emit('broadcast', '[Server]: Welcome stranger!');
  console.log("a user connected");
  // whenever we receive a 'message' we log it out
  socket.on("message", (message: any) => {
    console.log(message);
    io.emit('message', message);
  });
});


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