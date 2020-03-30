export interface IJoinResult {
    success: boolean
    roomId: string
    message: string
}

export interface INewPlayerJoined {
    nickname: string,
    id: string
}

export interface IJoinActionResult {
    success: boolean
    error: string
}

export interface IOwnerChanged {
    success: boolean
    error: string
}