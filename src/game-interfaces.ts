
export interface IRoom {
    id: string
    capacity: number
    players: IPlayer[]
}

export interface IPlayer {
    id: string
    nickname: string
    room_id: string
}

export interface IActionResult {
    succes: boolean
    error: string
}