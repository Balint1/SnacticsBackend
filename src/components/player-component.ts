import { ComponentType } from "../enums/component-type";
import { BaseComponent } from "./base-component";

export class PlayerComponent extends BaseComponent {

    playerId: string;

    constructor(playerId: string) {
        super()
        this.componentType = ComponentType.Player
        this.playerId = playerId
    }
}