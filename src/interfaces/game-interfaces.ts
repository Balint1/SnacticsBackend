import { Game } from '../game'

export interface IRoom {
    id: string
    capacity: number
    players: IPlayer[]
    game: Game
}

export interface IPlayer {
    id: string
    nickname: string
}

export interface IGameState {
    snakes: ISnake[]
}

export interface ISnake {
    id: string,
    x: number,
    y: number
}