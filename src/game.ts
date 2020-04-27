import {EntityPool} from "./entities/entity-pool";
import {ISystem} from "./interfaces/system-interfaces";
import {IGameState, IPlayer, ISettings} from './interfaces/game-interfaces'
import {SnakeFactory} from "./factory/SnakeFactory";
import {FoodFactory} from "./factory/FoodFactory";
import {DynamicsSystem} from "./systems/dynamics-system";
import {InputSystem} from "./systems/input-system";
import {config} from 'node-config-ts'
import {SocketEvents} from "./constants";
import {getLogger} from "./loggers";
import {CollisionSystem} from "./systems/collision-system";
import {SocketService} from "./socket-service";
import {PowerupSystem} from "./systems/powerup-system";
import {PowerupFactory} from "./factory/PowerupFactory";
import { PlayerSystem } from "./systems/player-system";
import { SnakeColorType } from "./Enums/snake-color-type";
import { randomBytes } from "crypto";


const logger = getLogger('game')

export class Game {
    private readonly roomId: string
    private readonly io = SocketService.io()
    private readonly settings: ISettings
    private players: IPlayer[]
    private entityPool: EntityPool = new EntityPool()
    private systems: ISystem[] = []
    private state: IGameState = {entities: [] }
    private timer: NodeJS.Timeout
    private _inProgress: boolean = false
    private idle: number = 0
    private originalPlayerCount = 0
        
    private playerSystem: PlayerSystem

    //Temporary solution:
    private spawningPlaces = [
        [10, 10],
        [10, 100],
        [10, 190],
        [10, 280],
    ]

    constructor(roomId: string, settings: ISettings) {
        this.roomId = roomId
        this.settings = settings
    }

    resetGame(){
        this.entityPool = new EntityPool()
        this.systems = []
        this.state = {entities: [] }
        clearTimeout(this.timer)
        this.timer = null
        this._inProgress = false
        this.idle = 0
        this.originalPlayerCount = 0

    }

    startGame(players: IPlayer[]) {
        this.resetGame()
        this._inProgress = true
        this.players = players
        this.originalPlayerCount = players.length

        this.playerSystem = new PlayerSystem(this, this.entityPool)
        this.systems.push(new InputSystem(this, this.entityPool, this.players))
        this.systems.push(new CollisionSystem(this, this.entityPool))
        this.systems.push(this.playerSystem)
        this.systems.push(new DynamicsSystem(this, this.entityPool, this.settings))
        this.systems.push(new PowerupSystem(this, this.entityPool))

        this.timer = setInterval(() => this.updateState(), config.ServerSettings.timerInterval)

        // Initialize the snakes
        let i = 0;
        players.forEach(p => {
            //TODO random position?


            let randomColor = [SnakeColorType.BlueSnake, SnakeColorType.GreenSnake][Math.floor(Math.random() * 2)]
            let snake = new SnakeFactory().create(p, this.spawningPlaces[i][0], this.spawningPlaces[i++][1], this.settings, this.roomId, randomColor, this.entityPool);
            snake.forEach(s => {
                this.entityPool.addEntity(s)
            });
        });

        this.entityPool.addEntity(new FoodFactory().create())
    }

    private updateState() {
        this.systems.forEach(s => {
            s.calculateNextState(this.idle)
        });

        let alivePlayers = 0
        this.entityPool.playerManager.forEach(p => {
            if(p.alive)
                alivePlayers++
        });
        if(alivePlayers < 2 && this.originalPlayerCount > 1){
            console.log("endGame")
            this.endGame()
            this.resetGame()
        }

        this.state.entities = []
        this.entityPool.entities.forEach(e => {
            //Can be optimized
            let changedComponents = e.components.filter(c => c.changed)
            if (changedComponents.length > 0) {
                this.state.entities.push.apply(this.state.entities, changedComponents.map(c => c.serialize()).filter(o => o != undefined))
                changedComponents.forEach(c => c.changed = false)
            }
        })

        if(this.state.entities.length > 0)
            this.io.to(this.roomId).emit(SocketEvents.UPDATE, {state: this.state.entities})

        // Send deleted entities if necessary
        if (this.entityPool.deletedEntities.size > 0) {
            let deletedIds = Array.from(this.entityPool.deletedEntities.keys())
            this.io.to(this.roomId).emit(SocketEvents.DELETE_ENTITIES, {entityIds: deletedIds})
            this.entityPool.deletedEntities.clear()
        }

        //Sometimes we have to reset the counter, this number won't break the rest ( % ) operation 
        this.idle = this.idle == config.ServerSettings.idleReset ? 0 : this.idle + 1
        return this.state
    }

    getPlayer(playerId: string) {
        return this.players.filter(player => player.id == playerId)[0]
    }

    removePlayer(playerId: string) {
        let player = this.getPlayer(playerId)

        // Check if the player was already removed
        if(!player)
            return;

        // Kill player if not dead
        let playerComponent = this.entityPool.playerManager.get(player.headEntityId)
        if(playerComponent && playerComponent.alive)
            this.playerSystem.killPlayer(playerComponent)
        else {
            this.players = this.players.filter(player => player.id != playerId)

            // Remove the player's entities from the ECS
            player.entities.forEach(e => this.entityPool.removeEntity(e.id))

            if (this.players.length == 0) {
                this.endGame()
            } else if (this.players.length == 1) {
                //TODO this is the winner send notification about wining game
            }
        }
    }

    endGame() {
        this._inProgress = false
        clearTimeout(this.timer)
    }

    get inProgress() {
        return this._inProgress
    }

    getEntities() {
        return this.entityPool.entities
    }
}