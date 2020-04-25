import {EntityFactory} from "./EntityFactory";
import {Entity} from "../entities/entity";
import {PositionComponent} from "../components/position-component";
import { ColliderComponent } from "../components/collider-component";
import { TagComponent } from "../components/tag-component";
import { TagType } from "../Enums/tag-type";
import {config} from 'node-config-ts'
import { PowerupComponent } from "../components/poweup-component";
import { PowerupType } from "../Enums/powerup-type";


export class PowerupFactory extends EntityFactory {
    /**
     * Creates powerup entity with initialized components
     */
    public create(): Entity {

        //TODO change to random
        let positionComponent = new PositionComponent(
            90,
            190
            // Math.floor(Math.random() * config.ServerSettings.fieldWidth),
            // Math.floor(Math.random() * config.ServerSettings.fieldHeight)
        )

        let powerup = new Entity()
        let colliderComponent = new ColliderComponent(config.FoodDefaults.foodColliderRadius)
        let powerupComponent = new PowerupComponent()
        powerupComponent.powerup = PowerupType.BreatheFire
        let tagComponent = new TagComponent(TagType.Powerup)
        powerup.addComponent(positionComponent)
        powerup.addComponent(colliderComponent)
        powerup.addComponent(powerupComponent)
        powerup.addComponent(tagComponent)

        return powerup
    }

}