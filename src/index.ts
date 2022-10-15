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
import Account from './entities/account';
import UserSocket from './utils';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "http://127.0.0.1:8080" }));
app.use(helmet());
app.use(routes);
app.use(express.static('public/uploads'));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    credentials: true,
  }
});

let activeUsers : UserSocket[] = [];

io.on("connection", (socket: any) => {
  //add new User
  socket.on("new-user-add", (newUserId: number) => {
    if(!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New Account Connected", activeUsers);
    }
    //send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter(user => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-user", activeUsers);
  })

  //send message to a specific user
  socket.on("send-message", (data: any) => {
    const { receiverId } = data;
    const user = activeUsers.find(user => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data: ", data);
    if(user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  })
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