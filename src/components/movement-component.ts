import {IComponent} from "../interfaces/component-interfaces";
import {ComponentType} from "../enums/component-type";
import {BaseComponent} from "./base-component";
import {SocketData} from "../helpers/decorators";
import {Vector2} from "../models/position";
import { GameConstants, SnakeSpeed } from "../constants";

export class MovementComponent extends BaseComponent {
    constructor() {
        super()
        this.componentType = ComponentType.Movement
        this.direction = new Vector2(0,0)
    }

    directionValue = 0

    direction:Vector2

    setDeltaDirection(delta:number){
        this.directionValue += delta
        this.direction = SnakeSpeed.speeds[this.directionValue]
    }

    // ( tick / block )
    speed:number
}