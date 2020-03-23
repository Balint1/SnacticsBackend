import { Game } from '../game'
import * as socketIo from 'socket.io';

export interface IRoom {
    id: string
    capacity: number
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

export interface ISnake {
    id: string,
    x: number,
    y: number
}