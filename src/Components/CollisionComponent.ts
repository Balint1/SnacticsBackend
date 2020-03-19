import { IComponent } from "./IComponent";
import { ComponentType } from "../Enums/ComponentType";

export class CollisionComponent implements IComponent{
    getComponentType: () => ComponentType.Collision;


}