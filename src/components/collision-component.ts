import { IComponent } from "../interfaces/component-interfaces";
import { ComponentType } from "../enums/component-type";

export class CollisionComponent implements IComponent {
    getComponentType: () => ComponentType.Collision;


}