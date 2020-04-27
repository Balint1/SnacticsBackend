import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";
import { ActivationType } from "../Enums/activation-type";

export class InvisiblePowerUp implements IPowerup{
    type:PowerupType
    activationStatus = PowerupActivationStatusType.AutoTriggered
    expiration: number
    playerEntityId: string
    entityPool: EntityPool
    activationType: ActivationType = ActivationType.Auto


    constructor(entityPool:EntityPool, playerEntityId:string){
        this.type = PowerupType.InvisibleAbility
        this.entityPool = entityPool
        this.playerEntityId = playerEntityId
    }
    activate(expiration:number): void {
        console.log("ACTIVATED INVISIBLE------------------------------------------------")
        let playerComponent = this.entityPool.playerManager.get(this.playerEntityId)

        playerComponent.invisible = true;
        playerComponent.setChanged() 

        this.expiration = expiration
        this.activationStatus = PowerupActivationStatusType.Activated
    }
    deactivate(): void {
        console.log("DEACTIVATED INVISIBLE------------------------------------------------")
        let playerComponent = this.entityPool.playerManager.get(this.playerEntityId)

        playerComponent.invisible = false;
        playerComponent.setChanged() 

        this.activationStatus = PowerupActivationStatusType.Used
    } 
}