import {EntityFactory} from "./EntityFactory";
import {Entity} from "../entities/entity";
import {PositionComponent} from "../components/position-component";
import { ColliderComponent } from "../components/collider-component";
import { TagComponent } from "../components/tag-component";
import { TagType } from "../Enums/tag-type";
import {config} from 'node-config-ts'
import { PowerupComponent } from "../components/poweup-component";
import { PowerupType } from "../Enums/powerup-type";
import { getRandomPowerUp } from "../helpers/powerUp-helper";
import { EntityPool } from "../entities/entity-pool";


export class PowerupFactory extends EntityFactory {
    private entityPool: EntityPool

    constructor(entityPool: EntityPool) {
        super()
        this.entityPool = entityPool
    }

    /**
     * Creates powerup entity with initialized components
     */
    public create(powerupType?: PowerupType): Entity {
        if(!powerupType) {
            // TODO add weights so the types aren't all as likely to spawn
            powerupType = getRandomPowerUp()
        }

        let radius = config.FoodDefaults.foodColliderRadius
        let spawnMargin = 25

        // Generate a position that doesn't collide with anything else
        let attemptsLeft = 10
        let x, y
        do {
            x = spawnMargin + Math.random() * (config.ServerSettings.fieldWidth  - 2*spawnMargin),
            y = spawnMargin + Math.random() * (config.ServerSettings.fieldHeight - 2*spawnMargin)
            attemptsLeft--
        } while(attemptsLeft > 0 && this.collides(x, y, radius*2))

        let powerup = new Entity()
        let positionComponent = new PositionComponent(x, y)
        let colliderComponent = new ColliderComponent(radius)
        let powerupComponent = new PowerupComponent(powerupType)
        let tagComponent = new TagComponent(TagType.Powerup)

        powerup.addComponents(positionComponent, colliderComponent, powerupComponent, tagComponent)

        return powerup
    }

    /**
     * Check if a given position is in the colliding radius of any collider entity.
     * @param x a horizontal coordinate
     * @param y a vertical coordinate
     * @param radius the radius in which to check for a collision
     */
    private collides(x: number, y: number, radius: number): boolean { 
        this.entityPool.colliderManager.forEach(collider => {
            let pos = this.entityPool.positionManager.get(collider.entityId).position

            // Check for collision
            let distanceSquared = Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)
            if (distanceSquared < Math.pow(collider.colliderRadius + radius, 2))
                return true
        })
        return false
    }

}