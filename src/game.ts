import { EntityPool } from "./entities/entity-pool";
import { ISystem } from "./interfaces/system-interfaces";
import { IGameState, IPlayer } from './interfaces/game-interfaces'
import { SnakeFactory } from "./factory/SnakeFactory";
import { FoodFactory } from "./factory/FoodFactory";
import { DynamicsSystem } from "./systems/dynamics-system";
import { InputSystem } from "./systems/input-system";
import {config} from 'node-config-ts'
import { SocketEvents } from "./constants";
import { getLogger } from "./loggers";
import { CollisionSystem } from "./systems/collision-system";
import { GameManager } from "./game-manager";
import { SocketService } from "./socket-service";
import { Setting } from "./models/game-setting";


const logger = getLogger('game')

export class Game {
    private readonly roomId: string
    private readonly gameManager: GameManager = GameManager.getInstance()
    private readonly io = SocketService.io()
    private players: IPlayer[]
    private entityPool: EntityPool = new EntityPool()
    private systems: ISystem[] = []
    private state: IGameState = {entities: []}
    private timer: NodeJS.Timeout
    private inProgress: boolean = false
    private settings:Setting = new Setting()

    //Temporary solution:
    private spawningPlaces = [
        [10, 10],
        [10, 290],
        [290, 10],
        [290, 290],
    ]

    constructor(roomId: string) {
        this.roomId = roomId
    }

    startGame(players: IPlayer[]) {
        this.inProgress = true
        this.players = players
        this.systems.push(new InputSystem(this.players, this.entityPool))
        this.systems.push(new CollisionSystem(this.entityPool))
        this.systems.push(new DynamicsSystem(this.entityPool, this.settings))
        this.addListeners()
        this.timer = setInterval(() => this.updateState(), config.ServerSettings.timerInterval)
        //initialize here
        let i = 0;
        players.forEach(p => {
            //TODO random position?
            let snake = SnakeFactory.create(p.id, this.spawningPlaces[i][0], this.spawningPlaces[i++][1], this.settings.snakeDefaults);
            snake.forEach(s => {
                this.entityPool.addEntity(s)
            });
        });

        this.entityPool.addEntity(new FoodFactory().create())
    }

    private updateState() {

        this.systems.forEach(s => {
            s.calculateNextState()
        });
        this.state.entities = []
        this.entityPool.entities.forEach(e => this.state.entities.push(e.components.map(c => c.serialize())))
        this.io.to(this.roomId).emit(SocketEvents.UPDATE, {state: this.state.entities})
        console.log("UPDATE:")
        this.entityPool.positionManager.forEach(element => {
            console.log("X: " + element.position.x + " Y : " + element.position.y + " ID : " + element.entityId)
        });
        return this.state
    }

    endGame() {
        this.inProgress = false
        clearTimeout(this.timer)
    }

    private addListeners = () => {
        this.players.map(player => {
            player.socket.on(SocketEvents.DISCONNECT, () => {
                logger.info(`${player.id} DISCONNECTED`)
                this.gameManager.leaveRoom(this.roomId, player.id, (error) => {
                    if (error) {
                        logger.error("LEAVE ROOM request FAILED")
                    }
                })
            })
        })
    }

}