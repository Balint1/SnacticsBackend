import { Entity } from "./entity";
import { PositionComponent } from "../components/position-component";

export class EntityPool {
    entities: Entity[]
    positions: PositionComponent[]
}