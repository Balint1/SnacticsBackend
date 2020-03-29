import {Game} from '../game'
import * as socketIo from 'socket.io';

export interface IRoom {
    id: string
    name: string
    password: string
    capacity: number
    ownerId: string
    players: IPlayer[]
    game: Game
}

export interface IPlayer {
    id: string
    nickname: string
    socket: socketIo.Socket
}

export interface IGameState {
    entities: object[]
}