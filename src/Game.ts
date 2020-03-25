import {EntityPool} from "./entities/entity-pool";
import {ISystem} from "./interfaces/system-interfaces";
import {GameConstants, SocketEvents} from "./constants";
import {SocketService} from './singletons/socket-service'
import {IGameState, IPlayer} from './interfaces/game-interfaces'
import {Entity} from "./entities/entity";
import {PositionComponent} from "./components/position-component";
import {SnakeFactory} from "./factory/SnakeFactory";
import {FoodFactory} from "./factory/FoodFactory";
import {DynamicsSystem} from "./systems/dynamics-system";
import {GameManager} from './singletons/game-manager'


export class Game {
    private readonly roomId: string
    private readonly gameManager: GameManager = GameManager.getInstance()
    private readonly io = SocketService.io()
    private players: IPlayer[]
    private entityPool: EntityPool = new EntityPool()
    private systems: ISystem[] = []
    private state: IGameState = {entities: []}
    private timer: NodeJS.Timeout

    //Temporary solution:
    private spawningPlaces = [
        [10, 10],
        [10, 290],
        [290, 10],
        [290, 290],
    ]

    constructor(roomId: string) {
        this.roomId = roomId
        this.systems.push(new DynamicsSystem(this.entityPool))
    }

    startGame(players: IPlayer[]) {
        this.players = players
        this.addListeners()
        this.timer = setInterval(() => this.updateState(), GameConstants.timerInterval)
        //initialize here
        let i = 0;
        players.forEach(p => {
            //TODO random position?
            let snake = SnakeFactory.create(this.spawningPlaces[i][0], this.spawningPlaces[i++][1]);
            this.entityPool.addEntity(snake)
        });

        this.entityPool.addEntity(new FoodFactory().create())
    }

    private updateState() {

        this.systems.forEach(s => {
            s.calculateNextState()
        });
        this.state.entities = this.entityPool.entities.map(e => e.components.map(c => c.serialize()))
        this.io.to(this.roomId).emit(SocketEvents.UPDATE, {state: this.state.entities})
        console.log(this.state.entities)
        return this.state
    }

    endGame() {
        clearTimeout(this.timer)
    }

    private addListeners = () => {
        this.players.map(player => {
            player.socket.on(SocketEvents.SLIDER_CHANGE, ({value}) => console.log(value))
            player.socket.on(SocketEvents.DISCONNECT, () => this.gameManager.leaveRoom(this.roomId, player.id))
        })
    }

}