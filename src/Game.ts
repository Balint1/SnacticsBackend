import { EntityPool } from "./entities/entity-pool";
import { ISystem } from "./interfaces/system-interfaces";
import { GameConstants, SocketEvents } from "./constants";
import { SocketService } from './singletons/socket-service'
import { IGameState, IPlayer } from './interfaces/game-interfaces'
import { Entity } from "./entities/entity";
import { PositionComponent } from "./components/position-component";
import { SnakeFactory } from "./factory/SnakeFactory";
import { FoodFactory } from "./factory/FoodFactory";
import { DynamicsSystem } from "./systems/dynamics-system";



export class Game {
    private entityPool: EntityPool = new EntityPool()
    private systems: ISystem[] = []
    private state: IGameState = { entities: [] }
    private players: IPlayer[]
    private room_id: string
    private timer: NodeJS.Timeout
    private io = SocketService.io()

    //Temporary solution:
    private spawningPlaces = [
        [10, 10],
        [10, 290],
        [290, 10],
        [290, 290],
    ]

    constructor(room_id: string) {
        this.room_id = room_id
        this.systems.push(new DynamicsSystem(this.entityPool))
    }

    startGame(players: IPlayer[]) {
        this.players = players
        this.timer = setInterval(() => this.updateState(), GameConstants.timerInterval)
        //initialize here
        var i = 0
        players.forEach(p => {
            //TODO random position?
            var snake = SnakeFactory.create(this.spawningPlaces[i][0], this.spawningPlaces[i++][1])
            this.entityPool.addEntity(snake)
        });

        this.entityPool.addEntity(new FoodFactory().create())
    }

    updateState() {

        this.systems.forEach(s => {
            s.calculateNextState()
        });
        this.state.entities = this.entityPool.entities.map(e => e.components.map(c => c.serialize()))
        this.io.to(this.room_id).emit(SocketEvents.UPDATE, { state: this.state.entities })
        console.log(this.state.entities)
        return this.state
    }

    endGame() {
        clearTimeout(this.timer)
    }

}