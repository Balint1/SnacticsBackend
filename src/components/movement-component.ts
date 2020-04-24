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

    direction: Vector2

    setDirection(dir: string){

        if(dir == "up" && this.direction != SnakeConstants.directions[4]){
          this.direction = SnakeConstants.directions[0]
        }else if(dir == "left"  && this.direction != SnakeConstants.directions[2]){
          this.direction = SnakeConstants.directions[6]
        }else if(dir == "down"  && this.direction != SnakeConstants.directions[0]){
          this.direction = SnakeConstants.directions[4]
        }else if(dir == "right"  && this.direction != SnakeConstants.directions[6]){
          this.direction = SnakeConstants.directions[2]
        }
    }
    // ( tick / block )
    speed: number
}
