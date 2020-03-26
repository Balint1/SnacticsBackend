import { EntityPool } from "./entities/entity-pool";
import { Vector2 } from "./models/position";

export enum SocketEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    ID = 'socket-id',
    NEW_PLAYER = 'new-player',
    JOIN_REQUEST = 'join-request',
    JOIN_SUCCEEDED = 'join-succeeded',
    JOIN_FAILED = 'join-failed',
    UPDATE = 'update-state',
    SLIDER_CHANGE = 'slider-change'
}

export class GameConstants {
    static readonly timerInterval: number = 1000;
    //TODO maybe it should be modifiable
    static fieldWidth = 300;
    static fieldHeight = 300;
    static snakeLength = 4;
    static blockLength = 20;

}

export class HelperConstants {
    static readonly SocketData = "SocketData"
}

export class SnakeConstants{
    static readonly speed = 3;

    static readonly directions = [
        new Vector2(0, GameConstants.blockLength),
        new Vector2(GameConstants.blockLength / Math.sqrt(2), GameConstants.blockLength / Math.sqrt(2)),
        new Vector2(GameConstants.blockLength, 0),
        new Vector2(GameConstants.blockLength / Math.sqrt(2), - GameConstants.blockLength / Math.sqrt(2)),
        new Vector2(0, - GameConstants.blockLength),
        new Vector2( - GameConstants.blockLength / Math.sqrt(2), - GameConstants.blockLength / Math.sqrt(2)),
        new Vector2( - GameConstants.blockLength, 0 ),
        new Vector2( - GameConstants.blockLength / Math.sqrt(2), GameConstants.blockLength / Math.sqrt(2)),
    ]
}

