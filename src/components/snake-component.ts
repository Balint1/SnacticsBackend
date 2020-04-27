import {ComponentType} from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { SocketData } from "../helpers/decorators";
import { SnakeColorType } from "../Enums/snake-color-type"

export class SnakeComponent extends BaseComponent {
    constructor() {
        super()
        this.componentType = ComponentType.Snake
    }

    @SocketData("entityId")
    next:SnakeComponent
}