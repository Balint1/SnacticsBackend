
import { IRoom, IPlayer } from '../interfaces/game-interfaces'
import { IActionResult } from '../interfaces/socket-interfaces'
import { getLogger } from '../loggers'

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
    private constructor() { }

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

    public createRoom(room: IRoom): void {
        this._rooms.push(room)
        logger.info(`Created new room with id ${room.id}`)
    }

    public startGame(room_id: string, callback): void {
        let gameRoom = this._rooms.find(room => room.id == room_id)
        if (gameRoom) {
            logger.info(`Started game in room with id ${room_id}`)
            gameRoom.game.startGame(gameRoom.players)
            callback()
        } else {
            logger.error(`Room with id: ${room_id} doesn't exists`)
            callback(`Room with id: ${room_id} doesn't exists`)
        }
    }

    public endGame(room_id: string, callback): void {
        let gameRoom = this._rooms.find(room => room.id == room_id)
        if (gameRoom) {
            logger.info(`Ended game in room with id ${room_id}`)
            gameRoom.game.endGame()
            callback()
        } else {
            logger.error(`Room with id: ${room_id} doesn't exists`)
            callback(`Room with id: ${room_id} doesn't exists`)
        }
    }

    public removeRoom(room_id: string, ): void {
        this._rooms = this._rooms.filter(room => room.id != room_id)
        logger.info(`Removed room with id: ${room_id}`)
    }

    /**
    * Add new user to room
    * Check if nickname is available in specified room
    */
    public joinRoom = (id: string, nickname: string, room_id: string): IActionResult => {
        const room = this._rooms.find(room => room.id == room_id)
        if (room) {
            if (room.players.length < room.capacity) {
                const nicknameTaken = room.players.find(player => player.nickname == nickname)
                if (nicknameTaken) {
                    return {
                        succes: false,
                        error: `Nickname: ${nickname} is already taken`
                    }
                } else {
                    room.players.push({ id, nickname } as IPlayer)
                    return {
                        succes: true,
                        error: null
                    } as IActionResult
                }
            } else {
                return {
                    succes: false,
                    error: `Room ${room_id} is full, can't join`
                }
            }
        } else {
            return {
                succes: false,
                error: `Room ${room_id} not found`
            }
        }
    }

    public leaveRoom = (id: string, rooms: any) => {
    }
}