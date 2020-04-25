import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";
import { ColliderComponent } from "../components/collider-component"

export class GreenSnakePowerup implements IPowerup{
    type:PowerupType
    activationStatus = PowerupActivationStatusType.AutoTriggered
    expiration: number
    playerEntityId: string
    entityPool: EntityPool

    constructor(entityPool:EntityPool, playerEntityId:string){
        this.type = PowerupType.GreenSnake
        this.entityPool = entityPool
        this.playerEntityId = playerEntityId
    }
    activate(expiration:number): void {
        console.log("ACTIVATED------------------------------------------------")
        let colliderComponent = this.entityPool.colliderManager.get(this.playerEntityId)
        this.expiration = -1
        this.activationStatus = PowerupActivationStatusType.Activated
        ColliderComponent.collideWithWalls = false
        console.log("ACTIVATED------------------------------------------------")

        
    }
    deactivate(): void {
        console.log("DEACTIVATED------------------------------------------------")
        let colliderComponent = this.entityPool.colliderManager.get(this.playerEntityId)
        ColliderComponent.collideWithWalls = true
        this.activationStatus = PowerupActivationStatusType.Inactive
        console.log("DEACTIVATED------------------------------------------------")
    } 
}