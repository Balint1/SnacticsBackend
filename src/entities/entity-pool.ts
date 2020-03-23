import {Entity} from "./entity";
import {PositionComponent} from "../components/position-component";
import {CollisionComponent} from "../components/collision-component";
import {MovementComponent} from "../components/movement-component";
import {IComponent} from "../interfaces/component-interfaces";


export class EntityPool {

    constructor() {
    }

    entities: Entity[] = []
    positionManager: PositionComponent[] = []
    collisionManager: CollisionComponent[] = []
    movementManager: MovementComponent[] = []
    managers: IComponent[][] = [
        this.positionManager,
        this.collisionManager,
        this.movementManager
    ]

    addEntity(entity: Entity) {
        this.entities.push(entity)


        entity.components.forEach(c => {
            let manager = c.componentType.toString() + "Manager"
            this[manager].push(c)
        });
    }

    removeEntity(entityId: string) {
        delete this.entities[this.entities.findIndex(e => e.id == entityId)]
        this.managers.forEach(m => {
            delete m[m.findIndex(e => e.entityId == entityId)]

        });

    }
}