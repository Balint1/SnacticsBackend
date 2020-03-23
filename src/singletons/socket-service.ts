import * as socketIo from 'socket.io';

import { Server } from 'http';

import { SocketEvents } from '../constants'
import { GameManager } from './game-manager'
import { IJoinResult, INewPlayerJoined, IActionResult } from '../interfaces/socket-interfaces'
import { getLogger } from '../loggers'

const logger = getLogger('socket')

export class SocketService {
    private static instance: SocketService
    private static _io: socketIo.Server
    private gameManager: GameManager = GameManager.getInstance()

    private constructor(server: Server) {
        SocketService._io = socketIo(server)
    }

    public listen(): void {
        SocketService._io.on(SocketEvents.CONNECT, (socket) => {
            logger.info(`New socket connected. id: ${socket.id}`)
            socket.on(SocketEvents.JOIN_REQUEST, ({ nickname, room_id }) => this.joinHandler(socket, nickname, room_id))
            socket.on(SocketEvents.DISCONNECT, () => this.disconnectHandler(socket))
            socket.on(SocketEvents.SLIDER_CHANGE, ({ value }) => console.log(value))
        })
    }

    private joinHandler(socket: socketIo.Socket, nickname: string, room_id: string) {
        logger.info(`New join room request from '${nickname}' id: '${socket.id}'`)
        const { succes, error }: IActionResult = this.gameManager.joinRoom(socket.id, nickname, room_id)
        if (succes) {
            socket.join(room_id, (err) => {
                if (error) {
                    logger.error(`Join room request from '${nickname}' id: '${socket.id} failed. cause: ${err}`)
                    socket.emit(SocketEvents.JOIN_FAILED, {
                        id: socket.id,
                        message: err
                    } as IJoinResult)
                } else {
                    logger.info(`Join room request from '${nickname}' id: '${socket.id} succeeded.`)
                    socket.emit(SocketEvents.JOIN_SUCCEEDED, {
                        id: socket.id,
                        message: `You successfully joined room ${room_id}`
                    } as IJoinResult)
                    socket.broadcast.to(room_id).emit(SocketEvents.NEW_PLAYER, {
                        nickname,
                        id: socket.id
                    } as INewPlayerJoined)
                }
            })
        } else {
            logger.error(`Join room request from '${nickname}' id: '${socket.id} failed. cause: ${error}`)
            socket.emit(SocketEvents.JOIN_FAILED, {
                id: socket.id,
                message: error
            } as IJoinResult)
        }
    }
    private disconnectHandler(socket: socketIo.Socket, ) {
        logger.info(`id: '${socket.id} disconnected.`)
        this.gameManager.leaveRoom(socket.id, socket.rooms)
    }

    public static io(): socketIo.Server {
        return SocketService._io
    }

    public static getInstance(server: Server): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService(server);
        }

        return SocketService.instance;
    }
}