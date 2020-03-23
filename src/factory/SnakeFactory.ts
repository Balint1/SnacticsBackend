import {EntityFactory} from "./EntityFactory";
import {BaseComponent} from "../components/base-component";
import {Entity} from "../entities/entity";
import {MovementComponent} from "../components/movement-component";
import {PositionComponent} from "../components/position-component";

export class SnakeFactory {
    public static create(x: number, y: number): Entity {
        let mc = new MovementComponent()
        mc.x = 17
        mc.y = 23

        var pc = new PositionComponent()
        pc.x = x
        pc.y = y

        let snake = new Entity()
        snake.addComponent(mc)
        snake.addComponent(pc)

        return snake
    }

}