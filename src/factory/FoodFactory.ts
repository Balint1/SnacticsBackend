import { EntityFactory } from "./EntityFactory";
import { Entity } from "../entities/entity";
import { PositionComponent } from "../components/position-component";
import { GameConstants } from "../constants";

export class FoodFactory extends EntityFactory{
    public create(): Entity {
        
        var mc = new PositionComponent()
        mc.x = Math.floor(Math.random() * GameConstants.fieldWidth)
        mc.y = Math.floor(Math.random() * GameConstants.fieldHeight)

        var food = new Entity()
        food.addComponent(mc)

        return food
    }

}