import {IPlayer} from "./interfaces/game-interfaces";
import {Game} from "./game";
import * as socketIo from "socket.io";
import { ISimpleResponse} from "./interfaces/response-interfaces";
import {SocketEvents} from "./constants";
import {getLogger} from './loggers'
import {GameManager} from "./games-manager";

const logger = getLogger('room manager')

export class RoomManager {
    id: string;
    name: string;
    password: string;
    ownerId: string;
    players: IPlayer[] = [];
    capacity: number;
    game: Game;

    constructor(id: string, name: string, password: string, ownerId: string, capacity: number) {
        this.id = id
        this.name = name
        this.password = password
        this.ownerId = ownerId
        this.capacity = capacity
        this.game = new Game(id)
    }

    addListeners = (socket: socketIo.Socket, roomId: string, playerId: string) => {
        socket.on(SocketEvents.DISCONNECT, () => {
            logger.info(`${playerId} DISCONNECTED`)
            this.leaveRoom(playerId)
        })
    }

    joinRoom = (socket: socketIo.Socket, nickname: string, password: string): ISimpleResponse => {
        if (this.players.length < this.capacity) {
            const nicknameTaken = this.players.find(player => player.nickname == nickname)
            if (password == this.password) {
                if (nicknameTaken) {
                    logger.error(`::joinRoom(${nickname}, ${password}) FAILED. cause: nickname already taken`)
                    return {
                        success: false,
                        message: `Nickname: ${nickname} is already taken`
                    }
                } else {
                    logger.info(`::joinRoom(${nickname}, ${password}) SUCCEEDED`)
                    this.players.push({id: socket.id, nickname, socket} as IPlayer)
                    this.addListeners(socket, this.id, socket.id)
                    return {
                        success: true,
                        message: null
                    }
                }
            } else {
                logger.error(`::joinRoom(${nickname}, ${password}) FAILED. cause: password is wrong`)
                return {
                    success: false,
                    message: `Password: ${password} is wrong`
                }
            }
        } else {
            logger.error(`::joinRoom(${nickname}, ${password}) FAILED. cause: room is full`)
            return {
                success: false,
                message: `Room ${this.name} is full, can't join`
            }
        }
    }


    leaveRoom = (playerId: string) => {
        this.leaveSocketRoom(playerId)
        this.players = this.players.filter(player => player.id != playerId)
        if (playerId == this.ownerId && this.players.length > 0) {
            this.changeOwner()
        } else if (this.players.length == 0) {
            this.game.endGame()
            GameManager.getInstance().forceDeleteRoom(this.id)
        }
    }


    startGame(playerId: string, callback): void {
        if (this.ownerId == playerId) {
            let message = `${this.ownerId} STARTED game in room: ${this.name} id ${this.id}`
            logger.info(message)
            this.game.startGame(this.players)
            callback()
        } else {
            let message = `Player with id: ${playerId} doesn't have permission to START game in room: ${this.name}`
            logger.error(message)
            callback("Only room owner can start the game")
        }
    }

    public endGame(playerId: string, callback): void {
        if (this.ownerId == playerId) {
            let message = `${playerId} ENDED game in room with id ${this.id}`
            logger.info(message)
            this.game.endGame()
            callback()
        } else {
            let message = `Player with id: ${playerId} doesn't have permission to END game in room: ${this.name}`
            logger.error(message)
            callback(message)
        }
    }

    private leaveSocketRoom(playerId: string) {
        let playerToRemove = this.players.find(player => player.id == playerId)
        if (playerToRemove && playerToRemove.socket) {
            playerToRemove.socket.leave(this.id, (err) => {
                if (err) {
                    logger.error(`leaveSocketRoom::request from '${playerId}' failed. cause: ${err}`)
                    playerToRemove.socket.emit(SocketEvents.LEAVE_RESPONSE, {
                        success: false,
                        message: err
                    })
                } else {
                    logger.info(`leaveSocketRoom::request from '${playerId}' succeeded.`)
                    playerToRemove.socket.emit(SocketEvents.LEAVE_RESPONSE, {
                        success: true,
                        message: null
                    })
                }
            })
        }

    }

    private changeOwner() {
        let newOwner = this.players[0]
        this.ownerId = newOwner.id
        newOwner.socket.emit(SocketEvents.OWNER_CHANGED, {
            success: true,
            message: null
        } as ISimpleResponse)
        logger.info(`changeOwner::OWNER CHANGED for room: ${this.name} new owner is:  ${newOwner.nickname}`)
    }
}