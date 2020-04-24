import {JsonController, Body, Get, Post} from "routing-controllers";
import {GameManager} from '../games-manager'
import {getLogger} from '../loggers'
import {Game} from "../game"
import {
    ICreateRoomBody,
    IStartGameBody,
    IEndGameBody,
    IRemoveRoomBody,
    ILeaveRoomBody
} from '../interfaces/http-request-interfaces'
import {
    ICreateRoomResponse,
    IGetRoomsResponse,
    ISimpleResponse
} from '../interfaces/response-interfaces'

const logger = getLogger('http')

@JsonController("/Rooms")
export class RoomController {
    private gameManager = GameManager.getInstance()

    constructor() {
    }

    @Post("/create")
    createRoom(@Body() params: ICreateRoomBody) {
        console.log(params.settings)
        let response: ICreateRoomResponse
        let {roomId, message} = this.gameManager.createRoom(
            params.name,
            params.password,
            params.capacity,
            params.ownerId
        )
        if (roomId) {
            logger.info("createRoom::CREATE ROOM request SUCCEEDED")
            response = {
                success: true,
                message: message,
                name: params.name,
                password: params.password,
                id: roomId,
                ownerId: params.ownerId
            }
        } else {
            logger.error("createRoom::CREATE ROOM request FAILED")
            response = {
                success: false,
                message: message,
                name: null,
                password: null,
                id: null,
                ownerId: null
            }
        }
        return response
    }

    @Post("/start")
    startGame(@Body() params: IStartGameBody) {
        let response: ISimpleResponse = {
            success: true,
            message: null
        }
        this.gameManager.startGame(params.roomId, params.playerId, (error: string) => {
            if (error) {
                logger.error("startGame::START GAME request FAILED")
                response = {
                    success: false,
                    message: error
                }
            }
        })
        logger.info("startGame::START GAME request SUCCEEDED")
        return response
    }


    @Get()
    getAllRooms() {
        let roomList = this.gameManager.rooms.map(room => {
            return {
                id: room.id,
                name: room.name,
                hasPassword: room.password != "",
                capacity: room.capacity,
                players: room.players.length,
                inProgress: room.game.inProgress
            }
        })
        logger.info("getAllRooms::GET ROOMS request SUCCEEDED")
        return {success: true, message: '', rooms: roomList} as IGetRoomsResponse
    }

    @Post("/endgame")
    endGame(@Body() params: IEndGameBody) {
        let response: ISimpleResponse = {
            success: true,
            message: null
        }
        this.gameManager.endGame(params.roomId, params.playerId, (error: string) => {
            if (error) {
                logger.error("endGame::END GAME request FAILED")
                response = {
                    success: false,
                    message: error
                }
            }
        })

        logger.info("endGame::END GAME request SUCCEEDED")
        return response
    }

    @Post("/remove")
    removeRoom(@Body() params: IRemoveRoomBody) {
        let response: ISimpleResponse = {
            success: true,
            message: null
        }
        this.gameManager.removeRoom(params.roomId, params.playerId, (error: string) => {
            if (error) {
                logger.error("removeRoom::REMOVE ROOM request FAILED")
                response = {
                    success: false,
                    message: error
                }
            }
        })

        logger.info("removeRoom::REMOVE ROOM request SUCCEEDED")
        return response
    }

    @Post("/leave")
    leaveRoomRequest(@Body() params: ILeaveRoomBody) {
        let response: ISimpleResponse = {
            success: true,
            message: null
        }
        this.gameManager.leaveRoom(params.roomId, params.playerId, (error: string) => {
            if (error) {
                logger.error("leaveRoom::LEAVE ROOM request FAILED")
                response = {
                    success: false,
                    message: error
                }
            }
        })

        logger.info("leaveRoom::LEAVE ROOM request SUCCEEDED")
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