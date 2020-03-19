import { IComponent } from "./IComponent";
import { ComponentType } from "../Enums/ComponentType";

export class MovementComponent implements IComponent{
    getComponentType: () => ComponentType.Movement;


}