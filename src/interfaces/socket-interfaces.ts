export interface IJoinResult {
    success: boolean
    roomId: string
    isOwner: boolean
    message: string
}

export interface INewPlayerJoined {
    nickname: string,
    id: string
}

export interface IJoinActionResult {
    success: boolean
    isOwner: boolean
    error: string
}