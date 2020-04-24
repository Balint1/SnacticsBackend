import * as socketIo from 'socket.io';
import {Entity} from "../entities/entity";

export interface ISettings {
    speed: number
    snakeLength: number
    colorsDisabled: boolean
}

export interface IPlayer {
    id: string
    nickname: string
    socket: socketIo.Socket
    entities: Entity[]
}

export interface IGameState {
    entities: object[]
}