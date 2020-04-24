interface ISettings {
    customSpeed: number
    snakeLength:  string
    colorsDisabled: boolean
}

export interface ICreateRoomBody {
    name: string
    password: string
    capacity: number
    ownerId: string
    settings: ISettings
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