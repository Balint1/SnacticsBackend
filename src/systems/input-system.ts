import { ISystem } from "../interfaces/system-interfaces";
import { IPlayer } from "../interfaces/game-interfaces";
import { SocketEvents } from "../constants";
import { EntityPool } from "../entities/entity-pool";
import { GameManager } from "../games-manager";
import { BaseSystem } from "./base-system";
import { Game } from "../game";

export class InputSystem extends BaseSystem {
    private players: IPlayer[]
    private gameManager = GameManager.getInstance()

    directions:Map<string, string> = new Map()

    constructor(game: Game, entityPool: EntityPool, players: IPlayer[]) {
        super(game, entityPool)
        this.players = players
        this.players.map(player => {
            this.directions.set(player.id, "")
            player.socket.on(SocketEvents.SWIPE, ({ direction }) => this.onValueChange(player.id, direction))
        })
    }

    calculateNextState(idle:number): void {
        this.entityPool.movementManager.forEach(m => {
            let player = this.entityPool.playerManager.get(m.entityId)
            
            m.setDirection(this.directions.get(player.playerId))
            this.directions.set(player.playerId, "")
        });
    }

    onValueChange(playerId:string, value:any){
        this.directions.set(playerId, value)
    }
}
