import { Entity } from "./Entity";
import { PositionComponent } from "./Components/PositionComponent";

export class EntityPool{
    entities: Entity
    positions: PositionComponent[]
}