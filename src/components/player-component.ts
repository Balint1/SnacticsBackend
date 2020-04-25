import { ComponentType } from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { SocketData } from "../helpers/decorators";
import { IPowerup } from "../powerups/powerup-interface";

export class PlayerComponent extends BaseComponent {

    @SocketData()
    playerId: string;
    @SocketData()
    powerups:IPowerup[] = []
    @SocketData()
    alive: boolean

    // Decay is the state where the snake is alive but has not yet disappeared.
    @SocketData()
    decaying: boolean

    // Whether or not the player has an invisible power-up enabled
    @SocketData()
    invisible: boolean

    // Number of ticks remaining until decay is finished and snake is removed
    @SocketData()
    remainingDecayTicks: number

    constructor(playerId: string) {
        super()
        this.componentType = ComponentType.Player
        this.playerId = playerId
        this.alive = true
        this.decaying = false
        this.invisible = false
    }
}