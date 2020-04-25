import { ISystem } from "../interfaces/system-interfaces";
import { IPlayer } from "../interfaces/game-interfaces";
import { EntityPool } from "../entities/entity-pool";
import { GameManager } from "../games-manager";
import { PlayerComponent } from "../components/player-component";
import {config} from "node-config-ts"

export class PlayerSystem implements ISystem {
    private players: IPlayer[];
    private entityPool: EntityPool;
    private gameManager = GameManager.getInstance()

    constructor(entityPool: EntityPool){
        this.entityPool = entityPool
    }
    
    calculateNextState(idle: number): void {
        this.entityPool.playerManager.forEach(player => {
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
    }
}