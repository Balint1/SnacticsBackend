import {Serializable} from "../helpers/serializable";
import {IComponent} from "../interfaces/component-interfaces";
import {ComponentType} from "../enums/component-type";
import { IChangeable } from "../interfaces/changable-interface";
import { SocketData } from "../helpers/decorators";

export abstract class BaseComponent extends Serializable implements IComponent, IChangeable {
    setChanged(): void {
        this.changed = true
    }
    changed: boolean = true;
    @SocketData()
    entityId: string
    @SocketData()
    componentType: ComponentType
}