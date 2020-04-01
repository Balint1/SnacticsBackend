
import * as socketIo from 'socket.io';

export interface IPlayer {
    id: string
    nickname: string
    socket: socketIo.Socket
}

export interface IGameState {
    entities: object[]
}