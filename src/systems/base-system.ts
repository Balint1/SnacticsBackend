import {ISystem} from "../interfaces/system-interfaces";
import {EntityPool} from "../entities/entity-pool";
import { Game } from "../game";

export abstract class BaseSystem implements ISystem {
    protected game: Game
    protected entityPool: EntityPool

    constructor(game: Game, entityPool: EntityPool) {
        this.entityPool = entityPool
    }

    abstract calculateNextState(idle:number): void
}