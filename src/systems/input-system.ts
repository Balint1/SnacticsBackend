import { ISystem } from "../interfaces/system-interfaces";
import { IPlayer } from "../interfaces/game-interfaces";
import { SocketEvents, GameConstants } from "../constants";
import { EntityPool } from "../entities/entity-pool";

export class InputSystem implements ISystem{
    private players: IPlayer[];
    private entityPool: EntityPool;
    
    deltaDirections:Map<string, number> = new Map()
    
    constructor(players: IPlayer[], entityPool:EntityPool){
        this.players = players
        this.entityPool = entityPool
        this.players.map(player => {
            this.deltaDirections.set(player.id, 0)
            player.socket.on(SocketEvents.SLIDER_CHANGE, ({ value }) => this.onValueChange(player.id, value))
            player.socket.on(SocketEvents.DISCONNECT, () => console.log("Leave room"))
        })
    }
    calculateNextState(): void {
        this.entityPool.movementManager.forEach(m => {

            m.setDeltaDirection(this.deltaDirections.get(this.players[0].id))
            this.deltaDirections.set(this.players[0].id, 0)
        });
    }

    onValueChange(playerId:string, value:any){
        console.log(value)
        this.deltaDirections.set(playerId, value)
    }

}