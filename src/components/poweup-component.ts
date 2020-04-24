import {ComponentType} from "../enums/component-type";
import {BaseComponent} from "./base-component";
import { PowerupType } from "../Enums/powerup-type";

export class PowerupComponent extends BaseComponent {

    powerup:PowerupType

    constructor() {
        super()
        this.componentType = ComponentType.Powerup
    }

}