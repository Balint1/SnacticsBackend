import { JsonController, QueryParams, QueryParam, Get, Post } from "routing-controllers";
import { GameManager } from './singletons/game-manager'
import { getLogger } from './loggers'

const logger = getLogger('http')

@JsonController("/Rooms")
export class RoomController {
  private gameManager = GameManager.getInstance()

  constructor() { }

  @Post("/create")
  createRoom() {
    let roomId = this.gameManager.createRoom()
    return { response: `created room with id ${roomId}` }
  }

  @Post("/start")
  startGame(@QueryParam("id") room_id: string) {
    let message: string
    this.gameManager.startGame(room_id, (error: string) => {
      if (error) {
        message = error
      }
      else {
        message = `Started game  in room with id ${room_id}`
      }
    })
    return { response: message }
  }

  @Get()
  getAllRooms() {
    return { response: this.gameManager.rooms.length }
  }

  @Post("/endgame")
  endStop(@QueryParam("id") room_id: string) {
    let message: string
    this.gameManager.endGame(room_id, (error: string) => {
      if (error) {
        message = error
      }
      else {
        message = `Ended game  in room with id ${room_id}`
      }
    })
    return { response: message }
  }

  @Post("/remove-room")
  removeRoom(@QueryParam("id") room_id: string) {
    this.gameManager.removeRoom(room_id)
    return { response: `Removed room with id: ${room_id}` }
  }
}