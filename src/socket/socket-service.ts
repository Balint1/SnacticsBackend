import * as express from 'express';
import * as socketIo from 'socket.io';
import { createServer, Server } from 'http';

import { ChatEvent } from '../constants'

import { ISocketId } from './socket-interfaces'

export class SocketServce {

    public static readonly PORT: number = 5000
    private app: express.Application
    private port: string | number = process.env.PORT || SocketServce.PORT
    private server: Server
    private io: socketIo.Server
    private socketsArray = [];

    constructor() {
        this.createApp()
        this.createServer()
        this.createSocket()
        this.listen()
    }

    private createApp(): void {
        this.app = express()
        this.app.use(express.static('public'));
    }
    private createServer(): void {
        this.server = createServer(this.app)
    }

    private createSocket(): void {
        this.io = socketIo(this.server)
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on(ChatEvent.CONNECT, (socket) => {
            console.log("new connection")
            socket.emit('socket-id', { id: socket.id } as ISocketId)
            socket.broadcast.emit('new-player', { id: socket.id } as ISocketId)
            socket.on(ChatEvent.DISCONNECT, () => {
                console.log("client disconected")
            });

        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}