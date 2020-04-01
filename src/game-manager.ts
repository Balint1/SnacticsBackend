import {Guid} from 'guid-typescript'
import {IRoom, IPlayer} from './interfaces/game-interfaces'
import {ISimpleResponse} from './interfaces/response-interfaces'
import {Game} from './game'
import {getLogger} from './loggers'
import * as socketIo from 'socket.io';
import {SocketEvents} from "./constants";

const logger = getLogger('game manager')

/**
 * Singleton GameManager class
 */
export class GameManager {
    private static instance: GameManager
    private _rooms: IRoom[] = []

    /**
     * Private constructor to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {
    }

    /**
     * The static method that controls the access to the singleton instance.
     */
    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }

        return GameManager.instance;
    }

    get rooms(): IRoom[] {
        return this._rooms
    }

    public createRoom(name: string, password: string, capacity: number, ownerId: string): { roomId: string, message: string } {
        let nameTaken = this._rooms.find(room => room.name == name)
        if (nameTaken) {
            logger.error(`Couldn't CREATE new room: ${name}, name already taken`)
            return {
                roomId: null,
                message: "Room with this name already exists"
            }
        } else {
            let roomId = Guid.raw()
            this._rooms.push({
                id: roomId,
                name: name,
                password: password,
                capacity: capacity,
                ownerId: ownerId,
                players: [],
                game: new Game(roomId)
            })
            logger.info(`${ownerId} CREATED new room: ${name} id: ${roomId}`)
            return {
                roomId: roomId,
                message: `Successfully created room ${name}`
            }
        }
    }

    public startGame(roomId: string, playerId: string, callback): void {
        let gameRoom = this._rooms.find(room => room.id == roomId)
        if (gameRoom) {
            if (gameRoom.ownerId == playerId) {
                let message = `${gameRoom.ownerId} STARTED game in room: ${gameRoom.name} id ${roomId}`
                logger.info(message)
                gameRoom.game.startGame(gameRoom.players)
                callback()
            } else {
                let message = `Player with id: ${playerId} doesn't have permission to START game in room: ${gameRoom.name}`
                logger.error(message)
                callback("Only room owner can start the game")
            }
        } else {
            let message = `Room with id: ${roomId} doesn't exists`
            logger.error(message)
            callback(message)
        }
    }

    public endGame(roomId: string, playerId: string, callback): void {
        let gameRoom = this._rooms.find(room => room.id == roomId)
        if (gameRoom) {
            if (gameRoom.ownerId == playerId) {
                let message = `${playerId} ENDED game in room with id ${roomId}`
                logger.info(message)
                gameRoom.game.endGame()
                callback()
            } else {
                let message = `Player with id: ${playerId} doesn't have permission to END game in room: ${gameRoom.name}`
                logger.error(message)
                callback(message)
            }
        } else {
            let message = `Room with id: ${roomId} doesn't exists`
            logger.error(message)
            callback(message)
        }
    }

    public removeRoom(roomId: string, playerId: string, callback): void {
        let gameRoom = this._rooms.find(room => room.id == roomId)
        if (gameRoom) {
            if (gameRoom.ownerId == playerId) {
                let message = `Player ${playerId} REMOVED room: ${gameRoom.name} id: ${roomId}`
                logger.info(message)
                this._rooms = this._rooms.filter(room => room.id != roomId)
                callback()
            } else {
                let message = `Player with id: ${playerId} doesn't have permission to REMOVE room: ${gameRoom.name}`
                logger.error(message)
                callback(message)
            }
        } else {
            let message = `Room with id: ${roomId} doesn't exists`
            logger.error(message)
            callback(message)
        }
    }

    /**
     * Add new user to room
     * Check if nickname is available in specified room
     */
    public joinRoom = (socket: socketIo.Socket, nickname: string, roomId: string, password: string): ISimpleResponse => {
        const room = this._rooms.find(room => room.id == roomId)
        if (room) {
            if (room.players.length < room.capacity) {
                const nicknameTaken = room.players.find(player => player.nickname == nickname)
                if (password == room.password) {
                    if (nicknameTaken) {
                        return {
                            success: false,
                            message: `Nickname: ${nickname} is already taken`
                        }
                    } else {
                        room.players.push({id: socket.id, nickname, socket} as IPlayer)
                        this.addListeners(socket, roomId, socket.id)
                        return {
                            success: true,
                            message: null
                        }
                    }
                } else {
                    return {
                        success: false,
                        message: `Password: ${password} is wrong`
                    }
                }
            } else {
                return {
                    success: false,
                    message: `Room ${room.name} is full, can't join`
                }
            }
        } else {
            return {
                success: false,
                message: `Room ${room.name} not found`
            }
        }
    }

    public leaveRoom = (roomId: string, playerId: string, callback) => {
        let gameRoom = this._rooms.find(room => room.id == roomId)
        if (gameRoom) {
            this.leaveSocketRoom(playerId, gameRoom)
            this.leaveServerRoom(playerId, gameRoom)
            if (playerId == gameRoom.ownerId && gameRoom.players.length > 0) {
                this.changeOwner(gameRoom)
                callback()
            } else if (gameRoom.players.length == 0) {
                this.deleteRoom(gameRoom)
                callback()
            }
            callback()
        } else {
            let message = `leaveRoom::Room with id: ${roomId} doesn't exists or was already removed`
            logger.error(message)
            callback(message)
        }
    }

    private leaveSocketRoom(playerId: string, gameRoom: IRoom) {
        let playerToRemove = gameRoom.players.find(player => player.id == playerId)
        playerToRemove.socket.leave(gameRoom.id, (err) => {
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

    private leaveServerRoom(playerId: string, gameRoom: IRoom) {
        gameRoom.players = gameRoom.players.filter(player => player.id != playerId) //remove player
        logger.info(`leaveServerRoom::${playerId} left room ${gameRoom.name} with id: ${gameRoom.id}`)
    }

    private changeOwner(gameRoom: IRoom) {
        let newOwner = gameRoom.players[0]
        gameRoom.ownerId = newOwner.id
        newOwner.socket.emit(SocketEvents.OWNER_CHANGED, {
            success: true,
            message: null
        } as ISimpleResponse)
        logger.info(`changeOwner::OWNER CHANGED for room: ${gameRoom.name} new owner is:  ${newOwner.nickname}`)
    }

    private deleteRoom(gameRoom: IRoom) {
        gameRoom.game.endGame()
        this._rooms = this._rooms.filter(room => room.id != gameRoom.id) //remove room
    }

    private addListeners = (socket: socketIo.Socket, roomId: string, playerId: string) => {
        socket.on(SocketEvents.DISCONNECT, () => {
            logger.info(`${playerId} DISCONNECTED`)
            this.leaveRoom(roomId, playerId, ()=>{})
        })
    }
}