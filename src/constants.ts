export enum SocketEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    ID = 'socket-id',
    NEW_PLAYER = 'new-player',
    JOIN_REQUEST = 'join-request',
    JOIN_SUCCEEDED = 'join-succeeded',
    JOIN_FAILED = 'join-failed',
    UPDATE = 'update-state'
}

export class GameConstants {
    static timerInterval: number = 1000;
    //TODO maybe it should be modifiable
    static fieldWidth = 1000;
    static fieldHeight = 1000;

}

export class HelperConstants{
    static SocketData = "SocketData"
}