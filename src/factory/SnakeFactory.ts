import { EntityFactory } from "./EntityFactory";
import { BaseComponent } from "../components/base-component";
import { Entity } from "../entities/entity";
import { MovementComponent } from "../components/movement-component";
import { PositionComponent } from "../components/position-component";
import { TagComponent } from "../components/tag-component";
import { TagType } from "../Enums/tag-type";
import { GameConstants, SnakeSpeed } from "../constants";
import { SnakeComponent } from "../components/snake-component";

export class SnakeFactory {
    public static create(x: number, y: number): Entity[] {

        var snake: Entity[] = []

        var piece = SnakeFactory.createSnakePiece(x, y, TagType.SnakeBody, null);

        snake.push(piece.snakePiece)
        
        for (let index = 1; index <= GameConstants.snakeLength; index++) {

             var {snakePiece,nextSnakeComponent} = SnakeFactory.createSnakePiece(
                (x + GameConstants.blockLength * index ) % GameConstants.fieldWidth,
                y,
                index == GameConstants.snakeLength ? TagType.SnakeHead : TagType.SnakeBody,
                nextSnakeComponent ? nextSnakeComponent : piece.nextSnakeComponent);
                var alma = (x + GameConstants.blockLength * index ) % GameConstants.fieldWidth

                snake.push(snakePiece)
            }
            
        return snake
    }

    private static createSnakePiece(x: number, y: number, tag: TagType, next: SnakeComponent) {
        

        let snakePiece = new Entity()
        var pc = new PositionComponent();
        pc.position.x = x;
        pc.position.y = y;
        var t = new TagComponent(tag);
        if (tag == TagType.SnakeHead) {
            let mc = new MovementComponent();
            mc.speed = 3
            mc.direction.x = SnakeSpeed.speeds[2].x
            mc.direction.y = SnakeSpeed.speeds[2].y
            snakePiece.addComponent(mc)
        }
        var snakeComponent = new SnakeComponent()
        snakeComponent.next = next

        snakePiece.addComponent(pc)
        snakePiece.addComponent(t)
        snakePiece.addComponent(snakeComponent)
        return { snakePiece, nextSnakeComponent:snakeComponent}
    }
}