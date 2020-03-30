import { Vector2 } from "./models/position";

export enum SocketEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    ID = 'socket-id',
    NEW_PLAYER = 'new-player',
    JOIN_REQUEST = 'join-request',
    JOIN_RESPONSE = 'join-response',
    UPDATE = 'update-state',
    SLIDER_CHANGE = 'slider-change',
    OWNER_CHANGED = 'owner-changed'
}

export class GameConstants {
    static readonly timerInterval: number = 1000;
    //TODO maybe it should be modifiable
    static fieldWidth = 300;
    static fieldHeight = 300;
    static blockLength = 20;
    static readonly foodColliderRadius = 6

}

export class HelperConstants {
    static readonly SocketData = "SocketData"
}

export class SnakeConstants{
    static readonly speed = 1;
    static readonly colliderRadius = 8;
    static readonly snakeLength = 4;


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

