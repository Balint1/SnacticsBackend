import {EntityFactory} from "./EntityFactory";
import {Entity} from "../entities/entity";
import {PositionComponent} from "../components/position-component";
import { ColliderComponent } from "../components/collider-component";
import { TagComponent } from "../components/tag-component";
import { TagType } from "../Enums/tag-type";
import {config} from 'node-config-ts'


export class FoodFactory extends EntityFactory {
    /**
     * Creates new Food entity with initialized components
     */
    public create(): Entity {

        let positionComponent = new PositionComponent(
            Math.floor(Math.random() * config.ServerSettings.fieldWidth),
            Math.floor(Math.random() * config.ServerSettings.fieldHeight)
        )

        let food = new Entity()
        let colliderComponent = new ColliderComponent(config.FoodDefaults.foodColliderRadius)
        let tagComponent = new TagComponent(TagType.Food)
        food.addComponent(positionComponent)
        food.addComponent(colliderComponent)
        food.addComponent(tagComponent)

        return food
    }

}