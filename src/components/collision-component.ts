import {ComponentType} from "../enums/component-type";
import {BaseComponent} from "./base-component";

export class CollisionComponent extends BaseComponent {
    constructor() {
        super()
        this.componentType = ComponentType.Position
    }
}