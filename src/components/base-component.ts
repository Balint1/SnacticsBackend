import {Serializable} from "../helpers/serializable";
import {IComponent} from "../interfaces/component-interfaces";
import {SocketData} from "../helpers/decorators";
import {ComponentType} from "../enums/component-type";

export abstract class BaseComponent extends Serializable implements IComponent {
    entityId: string
    @SocketData
    componentType: ComponentType
}