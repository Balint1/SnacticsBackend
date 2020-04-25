import {ComponentType} from "../enums/component-type";
import {BaseComponent} from "./base-component";

export class ColliderComponent extends BaseComponent {
    constructor(radius: number, collideWithWalls: boolean = false) {
        super()
        this.componentType = ComponentType.Collider
        this.colliderRadius = radius
        this.collideWithWalls = collideWithWalls
    }

    colliderRadius: number 
    collideWithWalls: boolean
    collided: boolean = false
}