import {EntityFactory} from "./EntityFactory";
import {Entity} from "../entities/entity";
import {PositionComponent} from "../components/position-component";
import {GameConstants} from "../constants";
import { ColliderComponent } from "../components/collider-component";
import { TagComponent } from "../components/tag-component";
import { TagType } from "../Enums/tag-type";

export class FoodFactory extends EntityFactory {
    public create(): Entity {

        // let positionComponent = new PositionComponent(
        //     Math.floor(Math.random() * GameConstants.fieldWidth),
        //     Math.floor(Math.random() * GameConstants.fieldHeight)
        // )

        let positionComponent = new PositionComponent(90,180)

        let food = new Entity()
        let colliderComponent = new ColliderComponent(GameConstants.foodColliderRadius)
        let tagComponent = new TagComponent(TagType.Food)
        food.addComponent(positionComponent)
        food.addComponent(colliderComponent)
        food.addComponent(tagComponent)

        return food
    }

}