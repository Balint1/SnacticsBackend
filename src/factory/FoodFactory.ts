import {EntityFactory} from "./EntityFactory";
import {Entity} from "../entities/entity";
import {PositionComponent} from "../components/position-component";
import {GameConstants} from "../constants";

export class FoodFactory extends EntityFactory {
    public create(): Entity {

        let positionComponent = new PositionComponent()
        positionComponent.position.x = Math.floor(Math.random() * GameConstants.fieldWidth)
        positionComponent.position.y = Math.floor(Math.random() * GameConstants.fieldHeight)

        let food = new Entity()
        food.addComponent(positionComponent)

        return food
    }

}