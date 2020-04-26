import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";
import { ActivationType } from "../Enums/activation-type";

export class SpeedBoosterPowerUp implements IPowerup{
    type:PowerupType
    activationStatus = PowerupActivationStatusType.AutoTriggered
    expiration: number
    playerEntityId: string
    entityPool: EntityPool
    activationType: ActivationType = ActivationType.Auto


    constructor(entityPool:EntityPool, playerEntityId:string){
        this.type = PowerupType.SpeedBooster
        this.entityPool = entityPool
        this.playerEntityId = playerEntityId
    }
    activate(expiration:number): void {
        console.log("ACTIVATED------------------------------------------------")
        let movementComponent = this.entityPool.movementManager.get(this.playerEntityId)
        if(movementComponent.speed > 1){
            this.expiration = expiration
            this.activationStatus = PowerupActivationStatusType.Atcivated
            movementComponent.speed = movementComponent.speed - 1
            console.log("ACTIVATED------------------------------------------------")

        }
    }
    deactivate(): void {
        console.log("DEACTIVATED------------------------------------------------")
        let movementComponent = this.entityPool.movementManager.get(this.playerEntityId)
        movementComponent.speed = movementComponent.speed + 1
        this.activationStatus = PowerupActivationStatusType.Used
        console.log("DEACTIVATED------------------------------------------------")
    } 
}