import { ISystem } from "../interfaces/system-interfaces";
import { EntityPool } from "../entities/entity-pool";

export class CollisionSystem implements ISystem{
    entityPool: EntityPool;
    
    constructor(entityPool: EntityPool) {
        this.entityPool = entityPool
    }
    
    calculateNextState(): void {
        this.entityPool.playerManager.forEach(playerCompomemt => {
            let headCollider = this.entityPool.colliderManager.get(playerCompomemt.entityId)
            let headPosition = this.entityPool.positionManager.get(playerCompomemt.entityId)

            this.entityPool.colliderManager.forEach(collider => {
                let colliderPosition = this.entityPool.positionManager.get(collider.entityId)
                let distance = headPosition.position.distance(colliderPosition.position)
                if(distance < headCollider.colliderRadius + collider.colliderRadius){
                    //Collision detected
                    console.log("Collision DETECTED!!!!!")
                }
            });
        });
    }

}