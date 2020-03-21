import { IComponent } from "../interfaces/component-interfaces";
import { ComponentType } from "../enums/component-type";

export class PositionComponent implements IComponent {
    getComponentType: () => ComponentType.Position;

}