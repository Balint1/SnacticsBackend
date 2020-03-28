import {ComponentType} from "../enums/component-type";

export interface IComponent {
    readonly componentType: ComponentType
    entityId: string
}