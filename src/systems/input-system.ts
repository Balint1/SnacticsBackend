import { ISystem } from "../interfaces/system-interfaces";
import { IPlayer } from "../interfaces/game-interfaces";
import { SocketEvents } from "../constants";
import { EntityPool } from "../entities/entity-pool";
import { GameManager } from "../games-manager";
import { BaseSystem } from "./base-system";
import { Game } from "../game";
import { ActivationType } from "../Enums/activation-type";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";
import { PowerupType } from "../Enums/powerup-type";

export class InputSystem extends BaseSystem {
    private players: IPlayer[]
    private gameManager = GameManager.getInstance()

    directions:Map<string, string> = new Map()

    constructor(game: Game, entityPool: EntityPool, players: IPlayer[]) {
        super(game, entityPool)
        this.players = players
        this.players.map(player => {
            this.directions.set(player.id, "")
            player.socket.on(SocketEvents.SWIPE, ({ direction }) => this.onSwipeValueChange(player.id, direction))
            player.socket.on(SocketEvents.USE_POWERUP, ({ powerup }) => this.onPowerupUse(player, powerup))
        })
    }

    calculateNextState(idle:number): void {
        this.entityPool.playerManager.forEach(player => {
            let movement = this.entityPool.movementManager.get(player.entityId)
            
            movement.setDirection(this.directions.get(player.playerId))
            this.directions.set(player.playerId, "")
        });
    }

    onSwipeValueChange(playerId:string, value:any){
        this.directions.set(playerId, value)
    }

    onPowerupUse(player:IPlayer, powerup:string){
        let playerComponent = this.entityPool.playerManager.get(player.headEntityId)
        let powerUpEnum = powerup as PowerupType
        let powerUps = playerComponent.powerups.filter(p => p.type == powerUpEnum && p.activationType == ActivationType.User && p.activationStatus == PowerupActivationStatusType.Inactive)
        if(powerUps.length > 0)
        {
            powerUps[0].activate(-1)
            playerComponent.setChanged()
        }
    }
}
