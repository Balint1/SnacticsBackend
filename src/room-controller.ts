import {JsonController, Param, Body, Get, Post} from "routing-controllers";
import {GameManager} from './singletons/game-manager'
import {getLogger} from './loggers'
import {Game} from "./game"
import {ICreateRoomBody, IStartGameBody, IEndGameBody, IRemoveRoomBody} from './interfaces/http-request-interfaces'

const logger = getLogger('http')

@JsonController("/Rooms")
export class RoomController {
    private gameManager = GameManager.getInstance()

    constructor() {
    }

    @Post("/create")
    createRoom(@Body() params: ICreateRoomBody) {
        let roomId = this.gameManager.createRoom(params.name, params.capacity, params.ownerId)

        if(roomId){
            return {
                success: true,
                message: "created room",
                name: params.name,
                id: roomId
            }
        }else {
            return {
                success: false,
                message: "Failed to create room",
                name: "",
                id: ""
            }
        }
    }

    @Post("/start")
    startGame(@Body() params: IStartGameBody) {
        let result = false
        this.gameManager.startGame(params.roomId, (success: boolean) => {
            result = success;
        })
        return {success: result}
    }


    @Get()
    getAllRooms() {
        let roomList = this.gameManager.rooms.map(room => {
            return {
                id: room.id,
                capacity: room.capacity,
                players: room.players.length
            }
        })

        return {rooms: roomList}
    }

    @Post("/endgame")
    endStop(@Body() params: IEndGameBody) {
        let result: boolean = false
        this.gameManager.endGame(params.roomId, params.playerId, (success: boolean) => {
            result = success;
        })
        return {success: result}
    }

    @Post("/remove")
    removeRoom(@Body() params: IRemoveRoomBody) {
        let result: boolean = false
        this.gameManager.removeRoom(params.roomId, params.playerId, (success: boolean) =>{
            result = success;
        })
        return {success: result}
    }

    @Get("/test")
    test() {

        let g = new Game("dsfds")
        g.startGame([
            {
            id: "dsa",
            nickname: "fds",
            socket: null
        }])

        return {test: "test"}
    }
}