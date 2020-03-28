interface Room {
    id: string
    capacity: number
    players: number
}


export interface IGetRoomsResponse {
    success: boolean
    message: string
    rooms: Room[]
}

export interface ICreateRoomResponse {
    success: boolean
    message: string
    name: string
    id: string
    ownerId: string
}

export interface IStartGameResponse {
    success: boolean
    message: string
}

export interface IEndGameResponse {
    success: boolean
    message: string
}


export interface IRemoveRoomResponse {
    success: boolean
    message: string
}