import {Entity} from "../entities/entity";
import {MovementComponent} from "../components/movement-component";
import {PositionComponent} from "../components/position-component";
import {TagComponent} from "../components/tag-component";
import {TagType} from "../Enums/tag-type";
import {SnakeComponent} from "../components/snake-component";
import {PlayerComponent} from "../components/player-component";
import {ColliderComponent} from "../components/collider-component";
import {config} from 'node-config-ts'
import {SnakeConstants} from "../constants";
import {ISettings, IPlayer} from "../interfaces/game-interfaces";
import { SnakeColorType } from "../Enums/snake-color-type";
import { RedSnakePowerup } from "../powerups/red-snake-constant-powerup"
import { GreenSnakePowerup } from "../powerups/green-snake-constant-powerup"
import { EntityPool } from "../entities/entity-pool";

export class SnakeFactory {
    /**
     * Creates a snake based on the given parameters
     */
    public create(player: IPlayer, x: number, y: number, settings: ISettings, snakeColorType:SnakeColorType, entityPool:EntityPool): Entity[] {

        let snake: Entity[] = [];

        let tail = this.createSnakePiece(player, x, y, settings.speed, TagType.SnakeBody, null);

        snake.push(tail.snakePiece)
        for (let index = 1; index <= settings.snakeLength; index++) {
            let isHead = index == settings.snakeLength;

            var {snakePiece, nextSnakeComponent} = this.createSnakePiece(
                player,
                (x + config.ServerSettings.blockLength * index) % config.ServerSettings.fieldWidth,
                y,
                settings.speed,
                isHead ? TagType.SnakeHead : TagType.SnakeBody,
                nextSnakeComponent ? nextSnakeComponent : tail.nextSnakeComponent);

            if(isHead)
                player.headEntityId = snakePiece.id

            snake.push(snakePiece)
        }

        if (snakeColorType == "RedSnake") {
            let playerComponent = new PlayerComponent(player.id)
            playerComponent.powerups.push(new RedSnakePowerup(entityPool, player.id))
        }
        if (snakeColorType == "GreenSnake") {
            let playerComponent = new PlayerComponent(player.id)
            playerComponent.powerups.push(new GreenSnakePowerup(entityPool, player.id))
        }

        return snake
    }

    createSnakePiece(player: IPlayer, x: number, y: number, speed: number, tag: TagType, next: SnakeComponent) {
        let snakePiece = new Entity()
        let positionComponent = new PositionComponent(x, y);
        let tagComponent = new TagComponent(tag);

        let colliderRadius = (tag == TagType.SnakeHead ? config.SnakeDefaults.headSizeFactor : 1) * config.SnakeDefaults.colliderRadius;

        if (tag == TagType.SnakeHead) {
            let playerComponent = new PlayerComponent(player.id)
            let movementComponent = new MovementComponent();
            movementComponent.speed = speed
            movementComponent.direction.x = SnakeConstants.directions[2].x
            movementComponent.direction.y = SnakeConstants.directions[2].y
            snakePiece.addComponent(movementComponent)
            snakePiece.addComponent(playerComponent)
            snakePiece.addComponent(new ColliderComponent(colliderRadius, true))
        }
        else {
            snakePiece.addComponent(new ColliderComponent(colliderRadius, false))
        }

        let snakeComponent = new SnakeComponent();
        snakeComponent.next = next

        snakePiece.addComponent(positionComponent)
        snakePiece.addComponent(tagComponent)
        snakePiece.addComponent(snakeComponent)
        
        player.entities.push(snakePiece)

        return {snakePiece, nextSnakeComponent: snakeComponent}
    }
}