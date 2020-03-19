import { ISystem } from "./system-interfaces";
import { Entity } from "../entity";
import { ComponentType } from "../enums/componentType";

export class DynamicsSystem implements ISystem {
    calculateNextState: (entities: Entity[]) => {
        // positionEntities: Entity[] = entities.filter(e =>
        //      e.Components.some(c =>
        //          c.getComponentType() == ComponentType.Position
        //          )
        //          )
        //          )
    };

}