import {EntityFactory} from "./EntityFactory";
import {Entity} from "../entities/entity";
import {PositionComponent} from "../components/position-component";
import {GameConstants} from "../constants";
import { ColliderComponent } from "../components/collider-component";

export class FoodFactory extends EntityFactory {
    public create(): Entity {

        let positionComponent = new PositionComponent(
            Math.floor(Math.random() * GameConstants.fieldWidth),
            Math.floor(Math.random() * GameConstants.fieldHeight)
        )

        let food = new Entity()
        let colliderComponent = new ColliderComponent(GameConstants.foodColliderRadius)
        food.addComponent(positionComponent)
        food.addComponent(colliderComponent)

        return food
    }

}