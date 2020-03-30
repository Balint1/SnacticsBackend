import * as express from 'express';
import * as bodyParser from 'body-parser';

import "reflect-metadata";

import {useExpressServer} from 'routing-controllers';
import {createServer, Server} from 'http';

import {SocketService} from './socket-service';
import {RoomController} from './room-controller';
import {getLogger} from './loggers'

const logger = getLogger('http')
const PORT: number = 5000
let port: string | number = process.env.PORT || PORT

let app = express()
let server: Server = createServer(app)

server.listen(port, () => {
    logger.info(`Running server on port ${port}`);
});

SocketService.getInstance(server).listen()

app.use(loggerMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

useExpressServer(app, {
    // register created express server in routing-controllers
    controllers: [RoomController], // and configure it the way you need (controllers, validation, etc.)
    routePrefix: "/api"
});


function loggerMiddleware(request: express.Request, response: express.Response, next) {
    logger.info(`${request.method} ${request.path}`);
    next();
}

export {app}