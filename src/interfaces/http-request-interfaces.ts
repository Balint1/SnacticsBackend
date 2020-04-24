import {ISettings} from "./game-interfaces";

export interface ICreateRoomBody {
    name: string
    password: string
    capacity: number
    ownerId: string
    settings: string
}

export interface IStartGameBody {
    roomId: string
    playerId: string
}

export interface IEndGameBody {
    roomId: string,
    playerId: string
}

export interface IRemoveRoomBody {
    roomId: string,
    playerId: string
}

export interface ILeaveRoomBody {
    roomId: string,
    playerId: string
}