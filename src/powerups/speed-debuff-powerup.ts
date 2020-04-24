import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";

export class SpeedDebuffPowerUp implements IPowerup{
    type:PowerupType
    activationStatus = PowerupActivationStatusType.AutoTriggered
    expiration: number
    playerEntityId: string
    entityPool: EntityPool

    constructor(entityPool:EntityPool, playerEntityId:string){
        this.type = PowerupType.SpeedDebuff
        this.entityPool = entityPool
        this.playerEntityId = playerEntityId
    }
    activate(expiration:number): void {
        console.log("ACTIVATED------------------------------------------------")
        this.expiration = expiration
        this.activationStatus = PowerupActivationStatusType.Activated
        let movementComponent = this.entityPool.movementManager.get(this.playerEntityId)
        movementComponent.speed = movementComponent.speed + 1
        console.log("ACTIVATED------------------------------------------------")
    }
    deactivate(): void {
        console.log("DEACTIVATED------------------------------------------------")
        let movementComponent = this.entityPool.movementManager.get(this.playerEntityId)
        movementComponent.speed = movementComponent.speed - 1
        this.activationStatus = PowerupActivationStatusType.Used
        console.log("DEACTIVATED------------------------------------------------")
    } 
}