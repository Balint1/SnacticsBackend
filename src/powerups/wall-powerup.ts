import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";
import { ColliderComponent } from "../components/collider-component"
import { ActivationType } from "../Enums/activation-type";
import { SnakeColorType } from "../Enums/snake-color-type";

export class WallPowerup implements IPowerup{
    type:PowerupType
    activationStatus = PowerupActivationStatusType.Inactive
    expiration: number
    playerEntityId: string
    entityPool: EntityPool
    activationType: ActivationType = ActivationType.User

    constructor(entityPool:EntityPool, playerEntityId:string){
        this.type = PowerupType.Wall
        this.entityPool = entityPool
        this.playerEntityId = playerEntityId
    }
    activate(expiration:number): void {
        console.log("ACTIVATED WALL------------------------------------------------")
        let colliderComponent = this.entityPool.colliderManager.get(this.playerEntityId)
        this.expiration = expiration
        this.activationStatus = PowerupActivationStatusType.Activated
        colliderComponent.collideWithWalls = false
    }
    
    deactivate(): void {
        console.log("DEACTIVATED WALL------------------------------------------------")
        let colliderComponent = this.entityPool.colliderManager.get(this.playerEntityId)
        let playerComponent = this.entityPool.playerManager.get(this.playerEntityId)
        if(playerComponent.color != SnakeColorType.GreenSnake)
            colliderComponent.collideWithWalls = true
        this.activationStatus = PowerupActivationStatusType.Used
    } 
}