import {ComponentType} from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { SocketData } from "../helpers/decorators";

export class SnakeComponent extends BaseComponent {
    constructor() {
        super()
        this.componentType = ComponentType.Snake
    }

    @SocketData("entityId")
    next:SnakeComponent
}