import {ComponentType} from "../enums/component-type";
import {BaseComponent} from "./base-component";

export class ColliderComponent extends BaseComponent {
    constructor(radius: number) {
        super()
        this.componentType = ComponentType.Collider
        this.colliderRadius = radius
    }
    colliderRadius:number

}