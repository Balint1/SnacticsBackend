
import * as socketIo from 'socket.io';
import {Entity} from "../entities/entity";

export interface IPlayer {
    id: string
    nickname: string
    socket: socketIo.Socket
    entities: Entity[]
}

export interface IGameState {
    entities: object[]
}