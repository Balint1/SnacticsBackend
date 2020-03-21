import { IComponent } from "../interfaces/component-interfaces";
import { ComponentType } from "../enums/component-type";

export class MovementComponent implements IComponent {
    getComponentType: () => ComponentType.Movement;


}