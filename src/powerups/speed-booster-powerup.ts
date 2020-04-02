import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";

export class SpeedBoosterPowerUp implements IPowerup{
    type:PowerupType
    activated:boolean = false
    expiration: number
    playerEntityId: string
    entityPool: EntityPool


    constructor(entityPool:EntityPool, playerEntityId:string){
        this.type = PowerupType.SpeedBooster
        this.entityPool = entityPool
        this.playerEntityId = playerEntityId
    }
    activate(expiration:number): void {
        console.log("ACTIVATED------------------------------------------------")
        this.expiration = expiration
        this.activated = true
        let movementComponent = this.entityPool.movementManager.get(this.playerEntityId)
        movementComponent.speed = movementComponent.speed + 1
        console.log("ACTIVATED------------------------------------------------")
    }
    deactivate(): void {
        console.log("DEACTIVATED------------------------------------------------")
        let movementComponent = this.entityPool.movementManager.get(this.playerEntityId)
        movementComponent.speed = movementComponent.speed - 1
        console.log("DEACTIVATED------------------------------------------------")
    } 
}