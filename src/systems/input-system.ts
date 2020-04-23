import { ISystem } from "../interfaces/system-interfaces";
import { IPlayer } from "../interfaces/game-interfaces";
import { SocketEvents } from "../constants";
import { EntityPool } from "../entities/entity-pool";
import { GameManager } from "../games-manager";

export class InputSystem implements ISystem{
    private players: IPlayer[];
    private entityPool: EntityPool;
    private gameManager = GameManager.getInstance()

    directions:Map<string, string> = new Map()

    constructor(players: IPlayer[], entityPool:EntityPool){
        this.players = players
        this.entityPool = entityPool
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
        console.log("we received something !!!")
        console.log(value)
        this.directions.set(playerId, value)
    }

}
