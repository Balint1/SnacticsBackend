import { ISystem } from "../interfaces/system-interfaces";
import { EntityPool } from "../entities/entity-pool";
import { TagType } from "../Enums/tag-type";
import { Vector2 } from "../models/position";
import {config} from 'node-config-ts'
import { BaseSystem } from "./base-system";
import { SpeedBoosterPowerUp } from "../powerups/speed-booster-powerup";
import { SnakeFactory } from "../factory/SnakeFactory"
import { SnakeComponent } from "../components/snake-component";

export class CollisionSystem extends BaseSystem{
    
    calculateNextState(idle:number): void {
        this.entityPool.playerManager.forEach(playerCompoment => {
            let headCollider = this.entityPool.colliderManager.get(playerCompoment.entityId)
            let headPosition = this.entityPool.positionManager.get(playerCompoment.entityId)

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
                            

                            //Adds the new piece to the snake, at the end of it
                            let headSnakePiece = this.entityPool.snakeManager.get(playerCompoment.entityId)
                            let tailSnakeComponent = headSnakePiece;
                            let beforeTailSnakeComponent: SnakeComponent = null;
                            let secondSnakeComponent = headSnakePiece.next;

                            //Get the tail of the snake
                            while(tailSnakeComponent.next){
                            beforeTailSnakeComponent = tailSnakeComponent
                            tailSnakeComponent = tailSnakeComponent.next
                            }

                            let tailPosition = this.entityPool.positionManager.get(tailSnakeComponent.entityId);
                            SnakeFactory.createSnakePiece(playerCompoment.entityId, tailPosition.position.x , tailPosition.position.y, 0, TagType.SnakeBody, null)

                            break;
                        case TagType.SnakeHead:
                            
                            break;
                        case TagType.SnakeBody:
                            
                            break;
                        
                        case TagType.Powerup:
                            let powerup = this.entityPool.powerupManager.get(colliderEntity.entityId)
                            
                            playerCompoment.powerups.push(new SpeedBoosterPowerUp(this.entityPool, playerCompoment.entityId))
                            break;
                        default:
                            break;
                    }
                }
            });
        });
    }

}