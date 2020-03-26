import {Entity} from "./entity";
import {PositionComponent} from "../components/position-component";
import {CollisionComponent} from "../components/collision-component";
import {MovementComponent} from "../components/movement-component";
import {IComponent} from "../interfaces/component-interfaces";
import { SnakeComponent } from "../components/snake-component";
import { TagComponent } from "../components/tag-component";
import { PlayerComponent } from "../components/player-component";

export class EntityPool {

    constructor() {
    }

    entities: Map<string, Entity> = new Map()
    positionManager: Map<string, PositionComponent> = new Map()
    collisionManager: Map<string, CollisionComponent> = new Map()
    movementManager: Map<string, MovementComponent> = new Map()
    snakeManager: Map<string, SnakeComponent> = new Map()
    tagManager: Map<string, TagComponent> = new Map()
    playerManager: Map<string, PlayerComponent> = new Map()
    managers: Map<string, IComponent>[] = [
        this.positionManager,
        this.collisionManager,
        this.movementManager,
        this.snakeManager,
        this.tagManager,
        this.playerManager
    ]

    addEntity(entity: Entity) {
        this.entities.set(entity.id, entity)

        entity.components.forEach(c => {
            let manager = c.componentType.toString() + "Manager"
            this[manager].set(c.entityId, c)
        });
    }

    removeEntity(entityId: string) {
        this.entities.delete(entityId)
        this.managers.forEach(m => {
            m.delete(entityId)
        });

    }
}