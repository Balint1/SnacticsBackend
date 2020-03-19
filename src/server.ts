import * as express from 'express';
import { createServer, Server } from 'http';

import { SocketServce } from './socket/socket-service';

const PORT: number = 5000
let port: string | number = process.env.PORT || PORT

let app = express()
let server: Server = createServer(app)

server.listen(port, () => {
    console.log('Running server on port %s', port);
});

let sockets = new SocketServce(app, server)
export { app }