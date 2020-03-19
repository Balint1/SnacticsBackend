import { IComponent } from "./component-interfaces";
import { ComponentType } from "../enums/componentType";

export class PositionComponent implements IComponent {
    getComponentType: () => ComponentType.Position;

}