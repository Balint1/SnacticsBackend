import {ComponentType} from "../enums/component-type";
import { BaseComponent } from "./base-component";

export class SnakeComponent extends BaseComponent {
    constructor() {
        super()
        this.componentType = ComponentType.Snake
    }
    next:SnakeComponent
}