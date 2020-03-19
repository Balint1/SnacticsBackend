import { IComponent } from "./component-interfaces";
import { ComponentType } from "../enums/componentType";

export class MovementComponent implements IComponent {
    getComponentType: () => ComponentType.Movement;


}