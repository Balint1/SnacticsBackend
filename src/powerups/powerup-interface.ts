import { PowerupType } from "../Enums/powerup-type";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";
import { ActivationType } from "../Enums/activation-type";

export interface IPowerup{
    type:PowerupType
    activationStatus:PowerupActivationStatusType
    expiration:number
    entityPool:EntityPool
    playerEntityId:string
    activationType:ActivationType
    

    /**
     * Activates the powerup and make changes through entity pool
     */
    activate(expiration:number): void;
    /**
     * Deactivates the powerup and makes the opposite changes of the activation
     */
    deactivate(): void;
    
}