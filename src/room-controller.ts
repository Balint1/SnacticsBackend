import {JsonController, Param, Body, Get, Post} from "routing-controllers";
import {GameManager} from './singletons/game-manager'
import {getLogger} from './loggers'
import {PositionComponent} from "./components/position-component";
import {EntityPool} from "./entities/entity-pool";
import {MovementComponent} from "./components/movement-component";
import {Entity} from "./entities/entity";
import {Game} from "./game";

const logger = getLogger('http')

class IStartGameBody {
    roomId: any
    playerId: string
}

@JsonController("/Rooms")
export class RoomController {
    private gameManager = GameManager.getInstance()

    constructor() {
    }

    @Post("/create")
    createRoom() {
        let roomId = this.gameManager.createRoom()
        return {response: `created room with id ${roomId}`}
    }

    @Post("/start")
    startGame(@Body() params: IStartGameBody) {
        let message: string = ''
        this.gameManager.startGame(params.roomId, (error: string) => {
            if (error) {
                message = error
            } else {
                message = `Started game in room with id ${params.roomId}, by player: ${params.playerId}:`
            }
        })
        return {response: message}
    }


    @Get()
    getAllRooms() {
        return {response: this.gameManager.rooms.length}
    }

    @Post("/endgame/:id")
    endStop(@Param("id") room_id: string) {
        let message: string = ''
        this.gameManager.endGame(room_id, (error: string) => {
            if (error) {
                message = error
            } else {
                message = `Ended game  in room with id ${room_id}`
            }
        })
        return {response: message}
    }

    @Post("/remove-room/:id")
    removeRoom(@Param("id") room_id: string) {
        this.gameManager.removeRoom(room_id)
        return {response: `Removed room with id: ${room_id}`}
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