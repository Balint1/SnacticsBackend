import { PowerupType } from "../Enums/powerup-type";
import { EntityPool } from "../entities/entity-pool";

export interface IPowerup{
    type:PowerupType
    activated:boolean
    expiration:number
    entityPool:EntityPool
    playerEntityId:string
    /**
     * Activates the powerup and make changes through entity pool
     */
    activate(expiration:number): void;
    /**
     * Deactivates the powerup and makes the opposite changes of the activation
     */
    deactivate(): void;
    
}