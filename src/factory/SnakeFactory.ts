import { EntityFactory } from "./EntityFactory";
import { BaseComponent } from "../components/base-component";
import { Entity } from "../entities/entity";
import { MovementComponent } from "../components/movement-component";
import { PositionComponent } from "../components/position-component";
import { TagComponent } from "../components/tag-component";
import { TagType } from "../Enums/tag-type";
import { GameConstants, SnakeConstants } from "../constants";
import { SnakeComponent } from "../components/snake-component";
import { PlayerComponent } from "../components/player-component";

export class SnakeFactory {
    public static create(playerId: string, x: number, y: number): Entity[] {

        var snake: Entity[] = []

        var tail = SnakeFactory.createSnakePiece(playerId, x, y, TagType.SnakeBody, null);

        snake.push(tail.snakePiece)

        for (let index = 1; index <= GameConstants.snakeLength; index++) {

            var { snakePiece, nextSnakeComponent } = SnakeFactory.createSnakePiece(
                playerId,
                (x + GameConstants.blockLength * index) % GameConstants.fieldWidth,
                y,
                index == GameConstants.snakeLength ? TagType.SnakeHead : TagType.SnakeBody,
                nextSnakeComponent ? nextSnakeComponent : tail.nextSnakeComponent);

            snake.push(snakePiece)
        }

        return snake
    }

    private static createSnakePiece(playerId: string, x: number, y: number, tag: TagType, next: SnakeComponent) {
        let snakePiece = new Entity()
        var positionComponent = new PositionComponent(x, y);
        var tagComponent = new TagComponent(tag);
        if (tag == TagType.SnakeHead) {
            let playerComponent = new PlayerComponent(playerId)
            let movementComponent = new MovementComponent();
            movementComponent.speed = SnakeConstants.speed
            movementComponent.direction.x = SnakeConstants.directions[2].x
            movementComponent.direction.y = SnakeConstants.directions[2].y
            snakePiece.addComponent(movementComponent)
            snakePiece.addComponent(playerComponent)
        }
        var snakeComponent = new SnakeComponent()
        snakeComponent.next = next

        snakePiece.addComponent(positionComponent)
        snakePiece.addComponent(tagComponent)
        snakePiece.addComponent(snakeComponent)
        return { snakePiece, nextSnakeComponent: snakeComponent }
    }
}