import { ComponentType } from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { SocketData } from "../helpers/decorators";

export class PlayerComponent extends BaseComponent {

    @SocketData
    playerId: string;

    constructor(playerId: string) {
        super()
        this.componentType = ComponentType.Player
        this.playerId = playerId
    }
}