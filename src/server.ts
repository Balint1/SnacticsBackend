import * as express from 'express';
import { createServer, Server } from 'http';

import { SocketServce } from './socket/socket-service';
import { Game } from './Game';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import "reflect-metadata";
import { useExpressServer } from "routing-controllers";
import { RoomController } from './RoomController';

const router = express.Router();
let app = new SocketServce().getApp();
app.use(loggerMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

useExpressServer(app, {
    // register created express server in routing-controllers
    controllers: [RoomController], // and configure it the way you need (controllers, validation, etc.)
    routePrefix: "/api"
  });

var game = new Game

app.get( "/start", ( req, res ) => {
    res.send( "Game started" );
    game.startGame()
} );

app.get( "/stop", ( req, res ) => {
    res.send( "Game stopped" );
    game.endGame()
} );
const PORT: number = 5000
let port: string | number = process.env.PORT || PORT

let app = express()
let server: Server = createServer(app)

server.listen(port, () => {
    console.log('Running server on port %s', port);
});

let sockets = new SocketServce(app, server)
export { app }

function loggerMiddleware(request: express.Request, response: express.Response, next) {
    console.log(`${request.method} ${request.path}`);
    next();
  }