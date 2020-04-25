import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";
import { FireballFactory } from "../factory/FireballFactory";
import { ActivationType } from "../Enums/activation-type";

export class BreatheFirePowerUp implements IPowerup{
    type:PowerupType
    activationStatus = PowerupActivationStatusType.Inactive
    expiration: number
    playerEntityId: string
    entityPool: EntityPool
    activationType: ActivationType = ActivationType.User

    constructor(entityPool:EntityPool, playerEntityId:string){
        this.type = PowerupType.BreatheFire
        this.entityPool = entityPool
        this.playerEntityId = playerEntityId
    }
    activate(expiration:number): void {
        console.log("ACTIVATED fire------------------------------------------------")
        let playerComponent = this.entityPool.playerManager.get(this.playerEntityId)
        let headPosition = this.entityPool.positionManager.get(this.playerEntityId)
        let movementComponent = this.entityPool.movementManager.get(this.playerEntityId)

        let fireball = new FireballFactory()
            .setPosition(headPosition.position)
            .setDirection(movementComponent.direction)
            .create()
        

        this.expiration = expiration
        this.activationStatus = PowerupActivationStatusType.Atcivated
    }
    deactivate(): void {
        console.log("DEACTIVATED fire------------------------------------------------")
        let playerComponent = this.entityPool.playerManager.get(this.playerEntityId)

        playerComponent.invisible = false;
        playerComponent.setChanged() 

        this.activationStatus = PowerupActivationStatusType.Inactive
    } 
}