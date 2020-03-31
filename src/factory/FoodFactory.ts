import {EntityFactory} from "./EntityFactory";
import {Entity} from "../entities/entity";
import {PositionComponent} from "../components/position-component";
import {config} from 'node-config-ts'


export class FoodFactory extends EntityFactory {
    public create(): Entity {

        let positionComponent = new PositionComponent(
            Math.floor(Math.random() * config.ServerSettings.fieldWidth),
            Math.floor(Math.random() * config.ServerSettings.fieldHeight)
        )

        let food = new Entity()
        food.addComponent(positionComponent)

        return food
    }

}