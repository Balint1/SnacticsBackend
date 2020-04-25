import {Vector2} from "./models/position";
import {config} from 'node-config-ts'

export enum SocketEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    NEW_PLAYER = 'new-player',
    PLAYER_LEFT_ROOM = 'player-left-room',
    JOIN_REQUEST = 'join-request',
    JOIN_RESPONSE = 'join-response',
    LEAVE_RESPONSE = 'leave-response',
    SWIPE = 'swipe',
    UPDATE = 'update-state',
    DELETE_ENTITIES = 'delete-entities',
    SLIDER_CHANGE = 'slider-change',
    OWNER_CHANGED = 'owner-changed',
    START_GAME = 'start-game',
    LEAVE_TO_LOBBY = 'leave-to-lobby',
    LEAVE_TO_LOBBY_RESPONSE = 'leave-to-lobby-response',
    PLAYER_LEFT_GAME = 'player-left-game',
    PLAYER_DIED = 'player-died',
    YOU_DIED = 'you-died'
}

export class HelperConstants {
    static readonly SocketData = "SocketData"
}

export class SnakeConstants {

    static readonly directions = [
        new Vector2(0, config.ServerSettings.blockLength),
        new Vector2(config.ServerSettings.blockLength / Math.sqrt(2), config.ServerSettings.blockLength / Math.sqrt(2)),
        new Vector2(config.ServerSettings.blockLength, 0),
        new Vector2(config.ServerSettings.blockLength / Math.sqrt(2), -config.ServerSettings.blockLength / Math.sqrt(2)),
        new Vector2(0, -config.ServerSettings.blockLength),
        new Vector2(-config.ServerSettings.blockLength / Math.sqrt(2), -config.ServerSettings.blockLength / Math.sqrt(2)),
        new Vector2(-config.ServerSettings.blockLength, 0),
        new Vector2(-config.ServerSettings.blockLength / Math.sqrt(2), config.ServerSettings.blockLength / Math.sqrt(2)),
    ]
}
