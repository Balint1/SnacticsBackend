interface Room {
    id: string
    name: string
    password: string
    capacity: number
    players: number
}

interface RoomForGet {
    id: string
    name: string
    hasPassword: boolean
    capacity: number
    players: number
}

export interface IGetRoomsResponse {
    success: boolean
    message: string
    rooms: RoomForGet[]
}

export interface ICreateRoomResponse {
    success: boolean
    message: string
    name: string
    password: string
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