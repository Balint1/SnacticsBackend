import {Guid} from 'guid-typescript'
import {IRoom, IPlayer} from '../interfaces/game-interfaces'
import {IActionResult} from '../interfaces/socket-interfaces'
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

    public createRoom(name: string, capacity: number, ownerId: string): string {
        let roomId = Guid.raw()
        this._rooms.push({
            id: roomId,
            name: name,
            capacity: capacity,
            ownerId: ownerId,
            players: [],
            game: new Game(roomId)
        })
        logger.info(`${ownerId} CREATED new room: ${name} id: ${roomId}`)
        return roomId
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
    public joinRoom = (socket: socketIo.Socket, nickname: string, roomId: string): IActionResult => {
        const room = this._rooms.find(room => room.id == roomId)
        if (room) {
            if (room.players.length < room.capacity) {
                const nicknameTaken = room.players.find(player => player.nickname == nickname)
                if (nicknameTaken) {
                    return {
                        success: false,
                        error: `Nickname: ${nickname} is already taken`
                    }
                } else {
                    room.players.push({id: socket.id, nickname, socket} as IPlayer)
                    return {
                        success: true,
                        error: null
                    } as IActionResult
                }
            } else {
                return {
                    success: false,
                    error: `Room ${roomId} is full, can't join`
                }
            }
        } else {
            return {
                success: false,
                error: `Room ${roomId} not found`
            }
        }
    }

    public leaveRoom = (roomId: string, playerId: string) => {
        let gameRoom = this._rooms.find(room => room.id == roomId)
        if (gameRoom) {
            gameRoom.players = gameRoom.players.filter(player => player.id != playerId)
            logger.info(`${playerId} left room ${gameRoom.name} with id: ${roomId}`)
        } else {
            logger.error(`Room with id: ${roomId} doesn't exists`)
        }
    }
}