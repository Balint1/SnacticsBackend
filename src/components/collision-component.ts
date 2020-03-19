import { IComponent } from "./component-interfaces";
import { ComponentType } from "../enums/componentType";

export class CollisionComponent implements IComponent {
    getComponentType: () => ComponentType.Collision;


}