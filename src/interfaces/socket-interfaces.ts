export interface IJoinResult {
    id: string
    message: string
}

export interface INewPlayerJoined {
    nickname: string,
    id: string
}

export interface IActionResult {
    success: boolean
    error: string
}