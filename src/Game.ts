import { EntityPool } from "./entities/entity-pool";
import { ISystem } from "./interfaces/system-interfaces";
import { GameConstants, SocketEvents } from "./constants";
import { SocketService } from './singletons/socket-service'
import { IGameState, IPlayer } from './interfaces/game-interfaces'



export class Game {
    private entityPool: EntityPool
    private systems: ISystem[]
    private state: IGameState = { snakes: [] }
    private players: IPlayer[]
    private room_id: string
    private timer: NodeJS.Timeout
    private io = SocketService.io()

    constructor(room_id: string) {
        this.room_id = room_id
    }

    startGame(players: IPlayer[]) {
        this.players = players
        this.createSnakes()
        this.timer = setInterval(() => this.updateState(), GameConstants.timerInterval)
    }

    updateState() {
        // this.systems.forEach(system => {
        //     system.calculateNextState(this.entityPool.entities)
        // });
        this.updatePosition()
        this.io.to(this.room_id).emit(SocketEvents.UPDATE, { state: this.state })
    }

    endGame() {
        clearTimeout(this.timer)
    }

    private createSnakes() {
        this.players.map(player => {
            this.state.snakes.push({
                id: player.id,
                x: Math.floor(Math.random() * 100) + 1,
                y: Math.floor(Math.random() * 100) + 1
            })
        })
    }

    private updatePosition() {
        this.state.snakes.map(snake => {
            snake.x = Math.floor(Math.random() * 100) + 1
            snake.y = Math.floor(Math.random() * 100) + 1
        })
    }
}