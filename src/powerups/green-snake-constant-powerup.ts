import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";
import { ColliderComponent } from "../components/collider-component"
import { ActivationType } from "../Enums/activation-type";

export class GreenSnakePowerup implements IPowerup{
    type:PowerupType
    activationStatus = PowerupActivationStatusType.AutoTriggered
    expiration: number
    playerEntityId: string
    entityPool: EntityPool
    activationType: ActivationType = ActivationType.Auto

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
        colliderComponent.collideWithWalls = false
        console.log("ACTIVATED------------------------------------------------")

        
    }
    deactivate(): void {
        console.log("DEACTIVATED------------------------------------------------")
        let colliderComponent = this.entityPool.colliderManager.get(this.playerEntityId)
        colliderComponent.collideWithWalls = true
        this.activationStatus = PowerupActivationStatusType.Inactive
        console.log("DEACTIVATED------------------------------------------------")
    } 
}