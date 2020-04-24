import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";

export class RedSnakePowerup implements IPowerup{
    type:PowerupType
    activationStatus = PowerupActivationStatusType.AutoTriggered
    expiration: number
    playerEntityId: string
    entityPool: EntityPool

    constructor(entityPool:EntityPool, playerEntityId:string){
        this.type = PowerupType.RedSnake
        this.entityPool = entityPool
        this.playerEntityId = playerEntityId
    }
    activate(): void {
        console.log("ACTIVATED------------------------------------------------")
        let movementComponent = this.entityPool.movementManager.get(this.playerEntityId)
        if(movementComponent.speed > 1){
            this.expiration = -1
            this.activationStatus = PowerupActivationStatusType.Activated
            movementComponent.speed = movementComponent.speed +1
            console.log("ACTIVATED------------------------------------------------")

        }
    }
    deactivate(): void {
        console.log("DEACTIVATED------------------------------------------------")
        let movementComponent = this.entityPool.movementManager.get(this.playerEntityId)
        movementComponent.speed = movementComponent.speed - 1
        this.activationStatus = PowerupActivationStatusType.Inactive
        console.log("DEACTIVATED------------------------------------------------")
    } 
}