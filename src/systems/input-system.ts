import { ISystem } from "../interfaces/system-interfaces";
import { IPlayer } from "../interfaces/game-interfaces";
import { SocketEvents } from "../constants";
import { EntityPool } from "../entities/entity-pool";
import { GameManager } from "../games-manager";

export class InputSystem implements ISystem{
    private players: IPlayer[];
    private entityPool: EntityPool;
    private gameManager = GameManager.getInstance()
    
    deltaDirections:Map<string, number> = new Map()
    
    constructor(players: IPlayer[], entityPool:EntityPool){
        this.players = players
        this.entityPool = entityPool
        this.players.map(player => {
            this.deltaDirections.set(player.id, 0)
            player.socket.on(SocketEvents.SLIDER_CHANGE, ({ value }) => this.onValueChange(player.id, value))
        })
    }
    calculateNextState(): void {
        this.entityPool.movementManager.forEach(m => {
            
            let player = this.entityPool.playerManager.get(m.entityId)
            m.setDeltaDirection(this.deltaDirections.get(player.playerId))
            this.deltaDirections.set(player.playerId, 0)
        });
    }

    onValueChange(playerId:string, value:any){
        this.deltaDirections.set(playerId, value)
    }

}