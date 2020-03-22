import { IComponent } from "../interfaces/component-interfaces";
import { ComponentType } from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { SocketData } from "../helpers/decorators";

export class MovementComponent extends BaseComponent {
    constructor(){
        super()
        this.componentType = ComponentType.Movement
    }
    
    @SocketData
    x: number
    @SocketData
    y: number 
}