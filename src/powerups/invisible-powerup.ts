import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";

export class InvisiblePowerUp implements IPowerup{
    type:PowerupType
    activationStatus = PowerupActivationStatusType.AutoTriggered
    expiration: number
    playerEntityId: string
    entityPool: EntityPool

    constructor(entityPool:EntityPool, playerEntityId:string){
        this.type = PowerupType.InvisibleAbility
        this.entityPool = entityPool
        this.playerEntityId = playerEntityId
    }
    activate(expiration:number): void {
        console.log("ACTIVATED INVISIBLE------------------------------------------------")
        let snakeComponent = this.entityPool.snakeManager.get(this.playerEntityId)
        
        snakeComponent.invisible = true;
        snakeComponent.setChanged() 

        while(snakeComponent.next){
            snakeComponent = snakeComponent.next
            snakeComponent.invisible = true;
            snakeComponent.setChanged() 
        }
        this.expiration = expiration
        this.activationStatus = PowerupActivationStatusType.Atcivated
    }
    deactivate(): void {
        console.log("DEACTIVATED INVISIBLE------------------------------------------------")
        let snakeComponent = this.entityPool.snakeManager.get(this.playerEntityId)
        
        snakeComponent.invisible = false;
        snakeComponent.setChanged() 

        while(snakeComponent.next){
            snakeComponent = snakeComponent.next
            snakeComponent.invisible = false;
            snakeComponent.setChanged() 
        }
        this.activationStatus = PowerupActivationStatusType.Inactive
    } 
}