import { EntityPool } from "./entities/entity-pool";
import { ISystem } from "./interfaces/system-interfaces";
import { GameConstants, SocketEvents } from "./constants";
import { SocketService } from './singletons/socket-service'
import { IGameState, IPlayer } from './interfaces/game-interfaces'
import { Entity } from "./entities/entity";
import { PositionComponent } from "./components/position-component";



export class Game {
    private entityPool: EntityPool = { entities: [], positions: []}
    private systems: ISystem[]
    private state: IGameState = { entities: [] }
    private players: IPlayer[]
    private room_id: string
    private timer: NodeJS.Timeout
    private io = SocketService.io()

    constructor(room_id: string) {
        this.room_id = room_id
    }

    startGame(players: IPlayer[]) {
        this.players = players
        this.timer = setInterval(() => this.updateState(), GameConstants.timerInterval)
    }

    updateState() {
       
        this.state.entities = this.entityPool.entities.map(e => e.Components.map(c => c.serialize()))
        console.log(this.state)
        return this.state
        this.io.to(this.room_id).emit(SocketEvents.UPDATE, { state: this.state.entities })

    }

    endGame() {
        clearTimeout(this.timer)
    }

}