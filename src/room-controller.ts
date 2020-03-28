import {JsonController, Body, Get, Post} from "routing-controllers";
import {GameManager} from './singletons/game-manager'
import {getLogger} from './loggers'
import {Game} from "./game"
import {ICreateRoomBody, IStartGameBody, IEndGameBody, IRemoveRoomBody} from './interfaces/http-request-interfaces'
import {
    ICreateRoomResponse,
    IStartGameResponse,
    IEndGameResponse,
    IRemoveRoomResponse, IGetRoomsResponse
} from './interfaces/http-response-interfaces'

const logger = getLogger('http')

@JsonController("/Rooms")
export class RoomController {
    private gameManager = GameManager.getInstance()

    constructor() {
    }

    @Post("/create")
    createRoom(@Body() params: ICreateRoomBody) {
        let response: ICreateRoomResponse
        let {roomId, message} = this.gameManager.createRoom(params.name, params.capacity, params.ownerId)
        if (roomId) {
            logger.info("CREATE ROOM request SUCCEEDED")
            response = {
                success: true,
                message: message,
                name: params.name,
                id: roomId,
                ownerId: params.ownerId
            }
        } else {
            logger.error("CREATE ROOM request FAILED")
            response = {
                success: false,
                message: message,
                name: "",
                id: "",
                ownerId: ""
            }
        }
        return response
    }

    @Post("/start")
    startGame(@Body() params: IStartGameBody) {
        let response: IStartGameResponse = {
            success: true,
            message: ''
        }
        this.gameManager.startGame(params.roomId, params.playerId, (error: string) => {
            if (error) {
                response = {
                    success: false,
                    message: error
                }
            }
        })
        return response
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

        return {success: true, message: '', rooms: roomList} as IGetRoomsResponse
    }

    @Post("/endgame")
    endGame(@Body() params: IEndGameBody) {
        let response: IEndGameResponse = {
            success: true,
            message: ''
        }
        this.gameManager.endGame(params.roomId, params.playerId, (error: string) => {
            if (error) {
                logger.error("CREATE ROOM request FAILED")
                response = {
                    success: false,
                    message: error
                }
            }
        })

        logger.info("CREATE ROOM request SUCCEEDED")
        return response
    }

    @Post("/remove")
    removeRoom(@Body() params: IRemoveRoomBody) {
        let response: IRemoveRoomResponse = {
            success: true,
            message: ''
        }
        this.gameManager.removeRoom(params.roomId, params.playerId, (error: string) => {
            if (error) {
                logger.error("CREATE ROOM request FAILED")
                response = {
                    success: false,
                    message: error
                }
            }
        })

        logger.info("CREATE ROOM request SUCCEEDED")
        return response
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