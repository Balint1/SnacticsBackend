import {ComponentType} from "../enums/component-type";
import {SocketData} from "../helpers/decorators";
import {Vector2} from "../models/position";
import {BaseComponent} from "./base-component";

export class PositionComponent extends BaseComponent {
    constructor(x:number, y:number) {
        super()
        this.componentType = ComponentType.Position
        this.position = new Vector2(x,y)
    }

    @SocketData
    position:Vector2

}