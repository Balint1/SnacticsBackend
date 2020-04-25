import { ISystem } from "../interfaces/system-interfaces";
import { IPlayer } from "../interfaces/game-interfaces";
import { EntityPool } from "../entities/entity-pool";
import { GameManager } from "../games-manager";
import { PlayerComponent } from "../components/player-component";
import {config} from "node-config-ts"
import {SocketEvents} from "../constants";
import {IPlayerEvent} from "../interfaces/response-interfaces";

export class PlayerSystem implements ISystem {
    private players: IPlayer[];
    private entityPool: EntityPool;
    private gameManager = GameManager.getInstance()

    constructor(entityPool: EntityPool){
        this.entityPool = entityPool
    }
    
    calculateNextState(idle: number): void {
        this.entityPool.playerManager.forEach(player => {
            let headCollider = this.entityPool.colliderManager.get(player.entityId)
            if(headCollider.collided && player.alive){
                this.killPlayer(player)
            }
            // Handle snake decay
            if(!player.alive) {
                if(player.decaying) {
                    player.remainingDecayTicks--;
                    if(player.remainingDecayTicks == 0)
                        player.decaying = false;
                    player.setChanged()
                }
            }
        });
    }

    killPlayer(player: PlayerComponent) {
        player.alive = false;
        player.decaying = true;
        player.remainingDecayTicks = config.SnakeDefaults.decayingTicks;
        player.setChanged();
        player.socket.emit(SocketEvents.YOU_DIED)
        player.socket.broadcast.to(player.roomId).emit(SocketEvents.PLAYER_DIED, {
            id: player.playerId
        }as IPlayerEvent)
    }
}
