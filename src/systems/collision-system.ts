import { TagType } from "../Enums/tag-type";
import {config} from "node-config-ts"
import { BaseSystem } from "./base-system";
import { SpeedBoosterPowerUp } from "../powerups/speed-booster-powerup";
import { SnakeFactory } from "../factory/SnakeFactory"
import { getRandomPowerUp } from "../helpers/powerUp-helper";
import { EntityPool } from "../entities/entity-pool";
import { Game } from "../game";
import { PowerupType } from "../Enums/powerup-type";
import { SpeedDebuffPowerUp } from "../powerups/speed-debuff-powerup";
import { InvisiblePowerUp } from "../powerups/invisible-powerup";


export class CollisionSystem extends BaseSystem {

    constructor(game: Game, entityPool: EntityPool) {
        super(game, entityPool)
    }

    calculateNextState(idle: number): void {
        // Handle player collisions into other objects
        this.entityPool.playerManager.forEach(playerComponent => {
            // Dead players cannot collide into anything
            if(!playerComponent.alive)
                return;

            let headCollider = this.entityPool.colliderManager.get(playerComponent.entityId)
            let headPosition = this.entityPool.positionManager.get(playerComponent.entityId)

            // Iterate over entities this player could collide with
            this.entityPool.colliderManager.forEach(collider => {
                let colliderPosition = this.entityPool.positionManager.get(collider.entityId)
                let distance = headPosition.position.distance(colliderPosition.position)
                
                if(colliderPosition.entityId != headCollider.entityId && distance < headCollider.colliderRadius + collider.colliderRadius) {
                    // Collision detected
                    
                    let colliderEntity = this.entityPool.tagManager.get(collider.entityId)

                    switch(colliderEntity?.tag) {
                        case TagType.Food:
                            //Maybe move to a function or function to food component
                            colliderPosition.position.x = Math.floor(Math.random() * config.ServerSettings.fieldWidth)
                            colliderPosition.position.y = Math.floor(Math.random() * config.ServerSettings.fieldHeight)
                            colliderPosition.setChanged()
                            
                            //Adds the new piece to the snake, at the end of it
                            let headSnakePiece = this.entityPool.snakeManager.get(playerComponent.entityId)
                            let tailSnakeComponent = headSnakePiece;

                            //Get the tail of the snake
                            while(tailSnakeComponent.next)
                                tailSnakeComponent = tailSnakeComponent.next

                            let tailPosition = this.entityPool.positionManager.get(tailSnakeComponent.entityId);
                            
                            //Create new tail and add it to the entity pool
                            let player = this.game.getPlayer(playerComponent.playerId)
                            let newTail = new SnakeFactory().createSnakePiece(player, tailPosition.position.x , tailPosition.position.y, 0, TagType.SnakeBody, null)
                            this.entityPool.addEntity(newTail.snakePiece)
                            
                            //Connect new tail to the previous tail
                            tailSnakeComponent.next = newTail.nextSnakeComponent
                            tailSnakeComponent.setChanged()

                            break;
                        case TagType.SnakeHead:
                            // Head to head collision: kill both
                            headCollider.collided = true
                            break;
                        case TagType.SnakeBody:
                            // Head to body collision: kill head
                            headCollider.collided = true
                            break;
                        
                        case TagType.Powerup:
                            let powerup = this.entityPool.powerupManager.get(colliderEntity.entityId)
                            
                            switch(powerup.powerup){
                                case PowerupType.SpeedBooster:
                                    playerComponent.powerups.push(new SpeedBoosterPowerUp(this.entityPool, playerComponent.entityId))
                                    break;
                                case PowerupType.SpeedDebuff:
                                    playerComponent.powerups.push(new SpeedDebuffPowerUp(this.entityPool, playerComponent.entityId))
                                    break;
                                case PowerupType.InvisibleAbility:
                                    playerComponent.powerups.push(new InvisiblePowerUp(this.entityPool, playerComponent.entityId))
                                    break;

                            }

                            powerup.powerup = getRandomPowerUp() 
                            colliderPosition.position.x = Math.floor(Math.random() * config.ServerSettings.fieldWidth)
                            colliderPosition.position.y = Math.floor(Math.random() * config.ServerSettings.fieldHeight)
                            colliderPosition.setChanged()
                            break;
                        default:
                            break;
                    }
                }
            });

        });

        // Handle collision with walls
        this.entityPool.colliderManager.forEach(collider => {
            if(collider.collideWithWalls) {
                let pos = this.entityPool.positionManager.get(collider.entityId);
                let r = collider.colliderRadius;

                // Detect collision with wall
                if(pos.position.x - r < 0 || pos.position.x + r > config.ServerSettings.fieldWidth ||
                    pos.position.y - r < 0 || pos.position.y + r > config.ServerSettings.fieldHeight) {
                    
                    // Check if this is a player colliding
                    if(this.entityPool.playerManager.has(collider.entityId)) {
                        let player = this.entityPool.playerManager.get(collider.entityId);
                        if(player.alive){
                            collider.collided = true
                        }

                    }       
                }
            } 
        });
    }
}