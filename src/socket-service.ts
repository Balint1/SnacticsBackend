import * as socketIo from 'socket.io';

import {Server} from 'http';

import {SocketEvents} from './constants'
import {GameManager} from './games-manager'
import {IJoinResponse, INewPlayerJoined} from './interfaces/response-interfaces'
import {getLogger} from './loggers'

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
            socket.on(SocketEvents.JOIN_REQUEST, ({nickname, room_id, password}) => this.joinHandler(socket, nickname, room_id, password))
        })
    }

    private joinHandler(socket: socketIo.Socket, nickname: string, roomId: string, password: string) {
        logger.info(`New join room request from '${nickname}' id: '${socket.id}'`)
        const joinResponse: IJoinResponse = this.gameManager.joinRoom(socket, nickname, roomId, password)
        if (joinResponse.success) {
            socket.join(roomId, (err) => {
                if (err) {
                    logger.error(`Join room request from '${nickname}' id: '${socket.id} failed. cause: ${err}`)
                    socket.emit(SocketEvents.JOIN_RESPONSE, {
                        success: false,
                        roomId: null,
                        message: err,
                        players: null
                    } as IJoinResponse)
                } else {
                    logger.info(`Join room request from '${nickname}' id: '${socket.id} succeeded.`)
                    socket.emit(SocketEvents.JOIN_RESPONSE, joinResponse)
                    socket.broadcast.to(roomId).emit(SocketEvents.NEW_PLAYER, {
                        nickname,
                        owner: false
                    } as INewPlayerJoined)
                }
            })
        } else {
            logger.error(`Join room request from '${nickname}' id: '${socket.id} failed. cause: ${joinResponse.message}`)
            socket.emit(SocketEvents.JOIN_RESPONSE, {
                success: false,
                roomId: null,
                message: joinResponse.message,
                players: null
            } as IJoinResponse)
        }
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