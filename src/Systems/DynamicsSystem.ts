import { ISystem } from "./ISystem";
import { Entity } from "../Entity";
import { ComponentType } from "../Enums/ComponentType";

export class DynamicsSystem implements ISystem{
    calculateNextState: (entities: Entity[]) => {
        // positionEntities: Entity[] = entities.filter(e =>
        //      e.Components.some(c =>
        //          c.getComponentType() == ComponentType.Position
        //          )
        //          )
        //          )
    };

}