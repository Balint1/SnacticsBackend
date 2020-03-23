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
     * Private constructior to prevent direct
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

    public createRoom(): string {
        let roomId = "835aee55-3274-9f4f-dac5-87fb41f276f7" //Guid.raw()
        this._rooms.push({
            id: roomId,
            capacity: 4,
            players: [],
            game: new Game(roomId)
        })
        logger.info(`Created new room with id ${roomId}`)
        return roomId
    }

    public startGame(roomId: string, callback): void {
        let gameRoom = this._rooms.find(room => room.id == roomId)
        if (gameRoom) {
            logger.info(`Started game in room with id ${roomId}`)
            gameRoom.game.startGame(gameRoom.players)
            callback()
        } else {
            logger.error(`Room with id: ${roomId} doesn't exists`)
            callback(`Room with id: ${roomId} doesn't exists`)
        }
    }

    public endGame(roomId: string, callback): void {
        let gameRoom = this._rooms.find(room => room.id == roomId)
        if (gameRoom) {
            logger.info(`Ended game in room with id ${roomId}`)
            gameRoom.game.endGame()
            callback()
        } else {
            logger.error(`Room with id: ${roomId} doesn't exists`)
            callback(`Room with id: ${roomId} doesn't exists`)
        }
    }

    public removeRoom(roomId: string,): void {
        this._rooms = this._rooms.filter(room => room.id != roomId)
        logger.info(`Removed room with id: ${roomId}`)
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
            logger.info(`${playerId} left room with id ${roomId}`)
        } else {
            logger.error(`Room with id: ${roomId} doesn't exists`)
        }
    }
}