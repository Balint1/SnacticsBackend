import {Guid} from 'guid-typescript'
import {IRoom, IPlayer} from '../interfaces/game-interfaces'
import {IJoinActionResult} from '../interfaces/socket-interfaces'
import {Game} from '../game'
import {getLogger} from '../loggers'
import * as socketIo from 'socket.io';

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
                let message = `Player with id: ${playerId} doesn't have permission to end START in room: ${gameRoom.name}`
                logger.error(message)
                callback(message)
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
    public joinRoom = (socket: socketIo.Socket, nickname: string, roomId: string, password: string): IJoinActionResult => {
        const room = this._rooms.find(room => room.id == roomId)
        if (room) {
            if (room.players.length < room.capacity) {
                const nicknameTaken = room.players.find(player => player.nickname == nickname)
                if (password == room.password) {
                    if (nicknameTaken) {
                        return {
                            success: false,
                            isOwner: null,
                            error: `Nickname: ${nickname} is already taken`
                        }
                    } else {
                        room.players.push({id: socket.id, nickname, socket} as IPlayer)
                        return {
                            success: true,
                            isOwner: room.ownerId == socket.id,
                            error: null
                        }
                    }
                }else {
                    return {
                        success: false,
                        isOwner: null,
                        error: `Password: ${password} is wrong`
                    }
                }
            } else {
                return {
                    success: false,
                    isOwner: null,
                    error: `Room ${room.name} is full, can't join`
                }
            }
        } else {
            return {
                success: false,
                isOwner: null,
                error: `Room ${room.name} not found`
            }
        }
    }

    public leaveRoom = (roomId: string, playerId: string, callback) => {
        let gameRoom = this._rooms.find(room => room.id == roomId)
        if (gameRoom) {
            gameRoom.players = gameRoom.players.filter(player => player.id != playerId)
            logger.info(`${playerId} left room ${gameRoom.name} with id: ${roomId}`)
            callback()
        } else {
            let message = `Room with id: ${roomId} doesn't exists`
            logger.error(message)
            callback(message)
        }
    }
}