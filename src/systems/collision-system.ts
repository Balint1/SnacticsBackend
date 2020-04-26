import { TagType } from "../Enums/tag-type";
import { config } from "node-config-ts"
import { BaseSystem } from "./base-system";
import { SpeedBoosterPowerUp } from "../powerups/speed-booster-powerup";
import { SnakeFactory } from "../factory/SnakeFactory"
import { EntityPool } from "../entities/entity-pool";
import { Game } from "../game";
import { PowerupType } from "../Enums/powerup-type";
import { SpeedDebuffPowerUp } from "../powerups/speed-debuff-powerup";
import { InvisiblePowerUp } from "../powerups/invisible-powerup";
import { PlayerComponent } from "../components/player-component";
import { ColliderComponent } from "../components/collider-component";
import { TagComponent } from "../components/tag-component";


export class CollisionSystem extends BaseSystem {

    constructor(game: Game, entityPool: EntityPool) {
        super(game, entityPool)
    }

    calculateNextState(idle: number): void {
        // Handle collisions into other objects


        this.entityPool.colliderManager.forEach(collider => {
            let colliderPosition = this.entityPool.positionManager.get(collider.entityId)

            // Iterate over players this entity could collide with
            this.entityPool.colliderManager.forEach(collider1 => {
                if (collider.entityId == collider1.entityId)
                    return

                let collider1Position = this.entityPool.positionManager.get(collider1.entityId)
                let distance = collider1Position.position.distance(colliderPosition.position)

                if (distance < collider1.colliderRadius + collider.colliderRadius) {
                    // Collision detected
                    
                    let colliderTag = this.entityPool.tagManager.get(collider.entityId).tag
                    let collider1Tag = this.entityPool.tagManager.get(collider1.entityId).tag
                    
                    this.collideSnakeHead(colliderTag, collider1Tag, collider, collider1)
                    
                }
                this.collideWithWall(collider);
            });
        });

        // Handle collision with walls
        this.entityPool.colliderManager.forEach(collider => {

        });
    }

    private collideWithWall(collider: ColliderComponent) {
        if (collider.collideWithWalls) {
            let pos = this.entityPool.positionManager.get(collider.entityId);
            let r = collider.colliderRadius;
            // Detect collision with wall
            if (pos.position.x - r < 0 || pos.position.x + r > config.ServerSettings.fieldWidth ||
                pos.position.y - r < 0 || pos.position.y + r > config.ServerSettings.fieldHeight) {
                // Check if this is a player colliding
                if (this.entityPool.playerManager.has(collider.entityId)) {
                    let player = this.entityPool.playerManager.get(collider.entityId);
                    if (player.alive) {
                        collider.collided = true;
                    }
                }
            }
        }
    }

    private collideSnakeHead(colliderTag: TagType, collider1Tag: TagType, collider: ColliderComponent, collider1: ColliderComponent) {
        if (colliderTag == TagType.SnakeHead || collider1Tag == TagType.SnakeHead) {
            let headCollider: ColliderComponent
            let otherCollider: ColliderComponent
            let otherColliderTag: TagType
            
            if (colliderTag == TagType.SnakeHead) {
                headCollider = collider
                otherCollider = collider1
                otherColliderTag = collider1Tag
            }
            if (collider1Tag == TagType.SnakeHead) {
                headCollider = collider1
                otherCollider = collider
                otherColliderTag = colliderTag
            }
            
            let colliderPosition = this.entityPool.positionManager.get(otherCollider.entityId)
            let playerComponent = this.entityPool.playerManager.get(headCollider.entityId)

            // Dead players cannot collide into anything
            if (!playerComponent.alive)
                return;

            switch (otherColliderTag) {
                case TagType.Food:
                    //Maybe move to a function or function to food component
                    colliderPosition.position.x = Math.floor(Math.random() * config.ServerSettings.fieldWidth)
                    colliderPosition.position.y = Math.floor(Math.random() * config.ServerSettings.fieldHeight)
                    colliderPosition.setChanged()

                    //Adds the new piece to the snake, at the end of it
                    let headSnakePiece = this.entityPool.snakeManager.get(playerComponent.entityId)
                    let tailSnakeComponent = headSnakePiece;

                    //Get the tail of the snake
                    while (tailSnakeComponent.next)
                        tailSnakeComponent = tailSnakeComponent.next

                    let tailPosition = this.entityPool.positionManager.get(tailSnakeComponent.entityId);

                    //Create new tail and add it to the entity pool
                    let player = this.game.getPlayer(playerComponent.playerId)
                    let newTail = new SnakeFactory().createSnakePiece(player, tailPosition.position.x, tailPosition.position.y, 0, TagType.SnakeBody, null)
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
                    let powerup = this.entityPool.powerupManager.get(otherCollider.entityId)

                    switch (powerup.powerup) {
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

                    playerComponent.setChanged()
                    
                    this.entityPool.removeEntity(powerup.entityId)
                    break;
                default:
                    break;
            }
        }   
    }
}