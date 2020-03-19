
import { IRoom, IPlayer, IActionResult } from './game-interfaces'

/**
 * Singleton GameManager class
 */
export class GameManager {
    private static instance: GameManager
    private _rooms: IRoom[] = [{ id: "wsahx728y8qwfsg", capacity: 4, players: [] }]
    private _players: IPlayer[] = []

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
    get players(): IPlayer[] {
        return this._players
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
                        error: 'This nickname is already taken'
                    }
                } else {
                    room.players.push({ id, nickname, room_id } as IPlayer)
                    return {
                        succes: true,
                        error: null
                    } as IActionResult
                }
            } else {
                return {
                    succes: false,
                    error: "Room is full, can't join"
                }
            }
        } else {
            return {
                succes: false,
                error: 'Room not found'
            }
        }
    }

    public leaveRoom = (id: string, rooms: any) => {
    }
}