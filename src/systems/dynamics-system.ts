import { ISystem } from "../interfaces/system-interfaces";
import { Entity } from "../entities/entity";
import { ComponentType } from "../enums/component-type";

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