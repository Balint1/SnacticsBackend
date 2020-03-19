import { EntityPool } from "./EntityPool";
import { ISystem } from "./Systems/ISystem";
import { GameConstants } from "./constants";

export class Game{
    entityPool: EntityPool
    systems: ISystem[]
    private timer: NodeJS.Timeout

    startGame(){
        this.timer = setInterval(this.updateState, GameConstants.timerInterval)
    }

    updateState() {
        // this.systems.forEach(system => {
        //     system.calculateNextState(this.entityPool.entities)
        // });
    }

    endGame(){
        clearTimeout(this.timer)
    }
}