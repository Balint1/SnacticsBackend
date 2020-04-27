import { ComponentType } from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { SocketData } from "../helpers/decorators";
import { IPowerup } from "../powerups/powerup-interface";
import {Socket} from "socket.io";
import { SnakeColorType } from "../Enums/snake-color-type";

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
    
    @SocketData()
    color: SnakeColorType

    socket: Socket

    roomId: string

    constructor(playerId: string, socket: Socket, roomId: string) {
        super()
        this.componentType = ComponentType.Player
        this.playerId = playerId
        this.socket = socket
        this.roomId = roomId
        this.alive = true
        this.decaying = false
        this.invisible = false
    }
}