import {ComponentType} from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { SnakeColorType } from "../Enums/snake-color-type"

export class SnakeComponent extends BaseComponent {
    constructor() {
        super()
        this.componentType = ComponentType.Snake
    }
    next:SnakeComponent
    color: SnakeColorType
}