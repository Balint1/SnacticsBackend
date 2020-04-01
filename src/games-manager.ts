import {Guid} from 'guid-typescript'
import {ISimpleResponse} from './interfaces/response-interfaces'
import {getLogger} from './loggers'
import * as socketIo from 'socket.io';
import {RoomManager} from "./room-manager";

const logger = getLogger('game manager')

/**
 * Singleton GameManager class
 */
export class GameManager {
    private static instance: GameManager
    private _rooms: RoomManager[] = []

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

    get rooms(): RoomManager[] {
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
            this._rooms.push(new RoomManager(roomId, name, password, ownerId, capacity))
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
            gameRoom.startGame(playerId, (error) => {
                if (error) {
                    callback(error)
                }
            })
        } else {
            let message = `Room with id: ${roomId} doesn't exists`
            logger.error(message)
            callback(message)
        }
    }

    public endGame(roomId: string, playerId: string, callback): void {
        let gameRoom = this._rooms.find(room => room.id == roomId)
        if (gameRoom) {
            gameRoom.endGame(playerId, (error) => {
                if (error) {
                    callback(error)
                }
            })
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
            return room.joinRoom(socket, nickname, password)
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
            gameRoom.leaveRoom(playerId)
            callback()
        } else {
            let message = `leaveRoom::Room with id: ${roomId} doesn't exists or was already removed`
            logger.error(message)
            callback(message)
        }
    }

    forceDeleteRoom(roomId: string) {
        logger.info("deleteRoom::FORCED DELETION, no players left in room ")
        this._rooms = this._rooms.filter(room => room.id != roomId) //remove room
    }
}