import { Vector2 } from "./models/position";
import { config } from 'node-config-ts'

export enum SocketEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    NEW_PLAYER = 'new-player',
    JOIN_REQUEST = 'join-request',
    JOIN_RESPONSE = 'join-response',
    LEAVE_RESPONSE = 'leave-response',
    UPDATE = 'update-state',
    SLIDER_CHANGE = 'slider-change',
    OWNER_CHANGED = 'owner-changed'
}

export class HelperConstants {
    static readonly SocketData = "SocketData"
}

export class SnakeConstants {

    static readonly directions = [
        new Vector2(0, config.ServerSettings.blockLength),
        new Vector2(config.ServerSettings.blockLength / Math.sqrt(2), config.ServerSettings.blockLength / Math.sqrt(2)),
        new Vector2(config.ServerSettings.blockLength, 0),
        new Vector2(config.ServerSettings.blockLength / Math.sqrt(2), - config.ServerSettings.blockLength / Math.sqrt(2)),
        new Vector2(0, - config.ServerSettings.blockLength),
        new Vector2(- config.ServerSettings.blockLength / Math.sqrt(2), - config.ServerSettings.blockLength / Math.sqrt(2)),
        new Vector2(- config.ServerSettings.blockLength, 0),
        new Vector2(- config.ServerSettings.blockLength / Math.sqrt(2), config.ServerSettings.blockLength / Math.sqrt(2)),
    ]
}

