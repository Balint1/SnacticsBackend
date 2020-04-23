import * as socketIo from "socket.io";
import {getLogger} from './loggers'

//Interfaces
import {IJoinResponse, ISimpleResponse, IUpdatedList, ILeftToLobby} from "./interfaces/response-interfaces";
import {IPlayer} from "./interfaces/game-interfaces";

import {GameManager} from "./games-manager";
import {SocketEvents} from "./constants";
import {Game} from "./game";
import {SocketService} from "./socket-service";

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

    addListeners = (socket: socketIo.Socket) => {
        let id = socket.id
        socket.on(SocketEvents.DISCONNECT, () => {
            logger.info(`${id} DISCONNECTED`)
            this.leaveRoom(id)
        }).on(SocketEvents.LEAVE_TO_LOBBY, () => {
            logger.info(`${id} LEFT TO LOBBY`)
            this.leaveToLobby(id)
        })
    }

    joinRoom = (socket: socketIo.Socket, nickname: string, password: string): IJoinResponse => {
        if (this.players.length < this.capacity) {
            if (password == this.password) {
                const nicknameTaken = this.players.find(player => player.nickname == nickname)
                if (nicknameTaken) {
                    logger.error(`::joinRoom(${nickname}, ${password}) FAILED. cause: nickname already taken`)
                    return {
                        success: false,
                        roomId: null,
                        message: `Nickname: ${nickname} is already taken`,
                        players: null
                    }
                } else {
                    logger.info(`::joinRoom(${nickname}, ${password}) SUCCEEDED`)
                    this.players.push({id: socket.id, nickname, socket} as IPlayer)
                    this.addListeners(socket)
                    return {
                        success: true,
                        roomId: this.id,
                        message: `You successfully joined room ${this.id}`,
                        players: this.players.map(player => ({
                            nickname: player.nickname,
                            owner: player.id == this.ownerId
                        }))
                    }
                }
            } else {
                logger.error(`::joinRoom(${nickname}, ${password}) FAILED. cause: password is wrong`)
                return {success: false, roomId: null, message: `Password: ${password} is wrong`, players: null}
            }
        } else {
            logger.error(`::joinRoom(${nickname}, ${password}) FAILED. cause: room is full`)
            return {success: false, roomId: null, message: `Room ${this.name} is full, can't join`, players: null}
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
        this.notifyLeaving()
    }

    private leaveToLobby = (playerId: string) => {
        let player = this.players.find(player => player.id == playerId)
        if (player){
            //remove player from game
            this.game.removePlayer(playerId)
            //notify itself
            player.socket.emit(SocketEvents.LEAVE_TO_LOBBY_RESPONSE, {
                success: true,
                message: null
            }as ISimpleResponse )
            //notify other players that someone left the game
            player.socket.broadcast.to(this.id).emit(SocketEvents.PLAYER_LEFT_GAME, {
                id: playerId,
                success: true,
                message: null
            }as ILeftToLobby)
            //TODO stop sending rendering data for this player
        }else {
            player.socket.emit(SocketEvents.LEAVE_TO_LOBBY_RESPONSE, {
                success: false,
                message: `Player with id ${playerId} doesn't exist`
            }as ISimpleResponse )

        }
    }


    startGame(playerId: string, callback): void {
        if (this.ownerId == playerId) {
            this.players[0].socket.broadcast.to(this.id).emit(SocketEvents.START_GAME)
            this.game.startGame(this.players)
            let message = `${this.ownerId} STARTED game in room: ${this.name} id ${this.id}`
            logger.info(message)
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

    private notifyLeaving() {
        if (this.players.length > 0) {
            SocketService.io().to(this.id).emit(SocketEvents.PLAYER_LEFT_ROOM, {
                players: this.players.map(player => ({
                    nickname: player.nickname,
                    owner: player.id == this.ownerId
                }))
            } as IUpdatedList)
            logger.info(`notifyLeaving::sending updated players list for room: ${this.name}`)
        }
    }
}