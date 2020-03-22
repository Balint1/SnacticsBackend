import { EntityPool } from "./entities/entity-pool";
import { ISystem } from "./interfaces/system-interfaces";
import { GameConstants, SocketEvents } from "./constants";
import { SocketService } from './singletons/socket-service'
import { IGameState, IPlayer } from './interfaces/game-interfaces'
import { Entity } from "./entities/entity";
import { PositionComponent } from "./components/position-component";
import { SnakeFactory } from "./factory/SnakeFactory";
import { FoodFactory } from "./factory/FoodFactory";



export class Game {
    private entityPool: EntityPool = new EntityPool()
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
        //initialize here
        players.forEach(p => {
            //TODO random position?
            var snake = SnakeFactory.create(11,11)
            this.entityPool.addEntity(snake)
        });

        this.entityPool.addEntity(new FoodFactory().create())
    }

    updateState() {
       
        this.state.entities = this.entityPool.entities.map(e => e.components.map(c => c.serialize()))
        console.log(this.state)
        return this.state
        this.io.to(this.room_id).emit(SocketEvents.UPDATE, { state: this.state.entities })

    }

    endGame() {
        clearTimeout(this.timer)
    }

}