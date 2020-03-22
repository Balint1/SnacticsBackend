import { ISystem } from "../interfaces/system-interfaces";
import { EntityPool } from "../entities/entity-pool";

export abstract class BaseSystem implements ISystem{
    constructor(entityPool:EntityPool){
        this.entityPool = entityPool        
    }
    abstract calculateNextState(): void
    protected entityPool:EntityPool

}