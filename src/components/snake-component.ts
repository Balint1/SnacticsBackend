import {Serializable} from "../helpers/serializable";
import {IComponent} from "../interfaces/component-interfaces";
import {SocketData} from "../helpers/decorators";
import {ComponentType} from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { PositionComponent } from "./position-component";
import { Vector2 } from "../models/position";
import { Entity } from "../entities/entity";

export class SnakeComponent extends BaseComponent {
    constructor() {
        super()
        this.componentType = ComponentType.Snake
    }
    next:SnakeComponent
}