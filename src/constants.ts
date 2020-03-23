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

}

export class HelperConstants {
    static readonly SocketData = "SocketData"
}

