interface RoomForGet {
    id: string
    name: string
    hasPassword: boolean
    capacity: number
    players: number
    inProgress: boolean
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

export interface ISimpleResponse {
    success: boolean
    message: string
}

export interface IJoinResult {
    success: boolean
    roomId: string
    message: string
}

export interface INewPlayerJoined {
    nickname: string,
    id: string
}