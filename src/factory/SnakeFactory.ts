import { Entity } from "../entities/entity";
import { MovementComponent } from "../components/movement-component";
import { PositionComponent } from "../components/position-component";
import { TagComponent } from "../components/tag-component";
import { TagType } from "../Enums/tag-type";
import { SnakeComponent } from "../components/snake-component";
import { PlayerComponent } from "../components/player-component";
import { ColliderComponent } from "../components/collider-component";
import {config} from 'node-config-ts'
import { SnakeDefaults } from "../models/game-setting";
import { SnakeConstants } from "../constants";
import { SnakeColorType } from "../Enums/snake-color-type";

export class SnakeFactory {
    /**
     * creates a snake based on the given parameters
     */
    public static create(playerId: string, x: number, y: number, snakeDefaults:SnakeDefaults, snakeColorType:SnakeColorType): Entity[] {

        let snake: Entity[] = [];

        let tail = SnakeFactory.createSnakePiece(playerId, x, y,snakeDefaults.speed, TagType.SnakeBody, null);

        snake.push(tail.snakePiece)

        for (let index = 1; index <= snakeDefaults.length; index++) {

            var { snakePiece, nextSnakeComponent } = SnakeFactory.createSnakePiece(
                playerId,
                (x + config.ServerSettings.blockLength * index) % config.ServerSettings.fieldWidth,
                y,
                snakeDefaults.speed,
                index == snakeDefaults.length ? TagType.SnakeHead : TagType.SnakeBody,
                nextSnakeComponent ? nextSnakeComponent : tail.nextSnakeComponent);

            snake.push(snakePiece)
        }

        return snake
    }

    static createSnakePiece(playerId: string, x: number, y: number, speed:number, tag: TagType, next: SnakeComponent) {
        let snakePiece = new Entity()
        let positionComponent = new PositionComponent(x, y);
        let tagComponent = new TagComponent(tag);
        let colliderComponent = new ColliderComponent(config.SnakeDefaults.colliderRadius)
        if (tag == TagType.SnakeHead) {
            let playerComponent = new PlayerComponent(playerId)
            let movementComponent = new MovementComponent();
            movementComponent.speed = speed
            movementComponent.direction.x = SnakeConstants.directions[2].x
            movementComponent.direction.y = SnakeConstants.directions[2].y
            snakePiece.addComponent(movementComponent)
            snakePiece.addComponent(playerComponent)
        }
        let snakeComponent = new SnakeComponent();
        snakeComponent.next = next

        snakePiece.addComponent(positionComponent)
        snakePiece.addComponent(tagComponent)
        snakePiece.addComponent(snakeComponent)
        snakePiece.addComponent(colliderComponent)
        return { snakePiece, nextSnakeComponent: snakeComponent }
    }
}