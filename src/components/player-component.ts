import { ComponentType } from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { SocketData } from "../helpers/decorators";
import { IPowerup } from "../powerups/powerup-interface";

export class PlayerComponent extends BaseComponent {

    @SocketData()
    playerId: string;
    @SocketData()
    powerups:IPowerup[] = []

    constructor(playerId: string) {
        super()
        this.componentType = ComponentType.Player
        this.playerId = playerId
    }
}