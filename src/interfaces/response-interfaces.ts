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

interface IPlayer {
    nickname: string,
    owner: boolean
}

export interface IJoinResponse {
    success: boolean
    roomId: string
    message: string
    players: IPlayer[]
}

export interface IUpdatedList {
    players: IPlayer[]
}
export interface INewPlayerJoined {
    nickname: string,
    owner: boolean
}