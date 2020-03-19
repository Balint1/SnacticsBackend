import { IComponent } from "./IComponent";
import { ComponentType } from "../Enums/ComponentType";

export class PositionComponent implements IComponent{
    getComponentType: () => ComponentType.Position;

}