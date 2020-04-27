import {Entity} from "./entity";
import {PositionComponent} from "../components/position-component";
import {ColliderComponent} from "../components/collider-component";
import {MovementComponent} from "../components/movement-component";
import {IComponent} from "../interfaces/component-interfaces";
import { SnakeComponent } from "../components/snake-component";
import { TagComponent } from "../components/tag-component";
import { PlayerComponent } from "../components/player-component";
import { PowerupComponent } from "../components/powerup-component";

/**
 * Stores entities and components in manager hashes
 * Fore each components you have to set it up here
*/
export class EntityPool {

    constructor() {

    }

    entities: Map<string, Entity> = new Map()
    positionManager: Map<string, PositionComponent> = new Map()
    colliderManager: Map<string, ColliderComponent> = new Map()
    movementManager: Map<string, MovementComponent> = new Map()
    snakeManager: Map<string, SnakeComponent> = new Map()
    tagManager: Map<string, TagComponent> = new Map()
    playerManager: Map<string, PlayerComponent> = new Map()
    powerupManager: Map<string, PowerupComponent> = new Map()
    
    // Register all managers here
    managers: Map<string, IComponent>[] = [
        this.positionManager,
        this.colliderManager,
        this.movementManager,
        this.snakeManager,
        this.tagManager,
        this.playerManager,
        this.powerupManager
    ]

    // Keep track of deleted entities so we can notify the client on the next state update
    deletedEntities: Map<string, Entity> = new Map()

    /**
     * Add a new entity and all of its components to the managers based on the name of the componentType
     */
    addEntity(entity: Entity) {
        this.entities.set(entity.id, entity)

        entity.components.forEach(c => {
            let manager = c.componentType.toString() + "Manager"
            this[manager].set(c.entityId, c)
        });
    }

    /**
     * Removes an entity. The entity will be stored temporarily until the clients are notified of its deletion.
     */
    removeEntity(entityId: string) {
        this.deletedEntities.set(entityId, this.entities.get(entityId))
        this.entities.delete(entityId)
        this.managers.forEach(m => {
            m.delete(entityId)
        });
    }
}