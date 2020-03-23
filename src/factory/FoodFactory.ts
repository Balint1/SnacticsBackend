import {EntityFactory} from "./EntityFactory";
import {Entity} from "../entities/entity";
import {PositionComponent} from "../components/position-component";
import {GameConstants} from "../constants";

export class FoodFactory extends EntityFactory {
    public create(): Entity {

        let mc = new PositionComponent()
        mc.x = Math.floor(Math.random() * GameConstants.fieldWidth)
        mc.y = Math.floor(Math.random() * GameConstants.fieldHeight)

        let food = new Entity()
        food.addComponent(mc)

        return food
    }

}