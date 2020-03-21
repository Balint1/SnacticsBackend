import { ComponentType } from "../enums/component-type";
import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { SocketData } from "../helpers/decorators";
import { BaseComponent } from "./base-component";

export class PositionComponent extends BaseComponent {
    constructor(){
        super()
        this.componentType = ComponentType.Position 
    }

    @SocketData
    x: number
    @SocketData
    y: number

}