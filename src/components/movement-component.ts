import { ComponentType } from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { Vector2 } from "../models/position";
import { SnakeConstants } from "../constants";

export class MovementComponent extends BaseComponent {
    constructor() {
        super()
        this.componentType = ComponentType.Movement
        this.direction = new Vector2(0, 0)
    }

    directionValue = 0

    direction: Vector2

    setDeltaDirection(delta: number) {
        this.directionValue = Number(this.directionValue) + Number(delta)
        this.directionValue = this.directionValue < 0 ?
            7 - ((-1 * this.directionValue) % 8)
            : (this.directionValue) % 8
        this.direction = SnakeConstants.directions[this.directionValue]
    }

    // ( tick / block )
    speed: number
}