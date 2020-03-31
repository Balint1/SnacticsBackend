import { ISystem } from "../interfaces/system-interfaces";
import { EntityPool } from "../entities/entity-pool";
import { TagType } from "../Enums/tag-type";
import { Vector2 } from "../models/position";
import {config} from 'node-config-ts'

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
                
                if(colliderPosition.entityId != headCollider.entityId && distance < headCollider.colliderRadius + collider.colliderRadius){
                    //Collision detected
                    
                    let colliderEntity = this.entityPool.tagManager.get(collider.entityId)

                    switch (colliderEntity?.tag) {
                        case TagType.Food:
                            //Maybe move to a function or function to food component
                            console.log("Change")
                            colliderPosition.position.x = Math.floor(Math.random() * config.ServerSettings.fieldWidth)
                            colliderPosition.position.y = Math.floor(Math.random() * config.ServerSettings.fieldHeight)
                            colliderPosition.setChanged()
                            break;
                        case TagType.SnakeHead:
                            
                            break;
                        case TagType.SnakeBody:
                            
                            break;
                    
                        default:
                            break;
                    }
                }
            });
        });
    }

}