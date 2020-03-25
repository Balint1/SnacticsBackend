export interface ICreateRoomBody {
    name: string
    capacity: number
    ownerId: string
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