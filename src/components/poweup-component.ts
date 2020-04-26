import {ComponentType} from "../enums/component-type";
import {BaseComponent} from "./base-component";
import { PowerupType } from "../Enums/powerup-type";
import { SocketData } from "../helpers/decorators";

export class PowerupComponent extends BaseComponent {
    @SocketData()
    powerup: PowerupType

    constructor(powerupType: PowerupType) {
        super()
        this.componentType = ComponentType.Powerup
        this.powerup = powerupType
    }
}