import { JsonController, QueryParams, QueryParam, Param, Body, Get, Post, Put, Delete, Params } from "routing-controllers";
import { Game } from "./game";
import { GameManager } from './singletons/game-manager'
import { getLogger } from './loggers'

const logger = getLogger('http')

@JsonController("/Rooms")
export class RoomController {
  private gameManager = GameManager.getInstance()

  constructor() { }

  @Get("/create")
  createRoom(@QueryParam('id') room_id: string) {
    this.gameManager.createRoom({
      id: room_id,
      capacity: 4,
      players: [],
      game: new Game(room_id)
    })
    return { response: `created room with id ${room_id}` }
  }

  @Get("/start")
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

  @Get("/endgame")
  endStop(@QueryParam("id") room_id: string) {
    let message: string
    this.gameManager.endGame(room_id, (error: string) => {
      if (error) {
        message = error
      }
      else {
        message = `Started game  in room with id ${room_id}`
      }
    })
    return { response: message }
  }

  @Get("/remove-room")
  removeRoom(@QueryParam("id") room_id: string) {
    this.gameManager.removeRoom(room_id)
    return { response: `Removed room with id: ${room_id}` }
  }
}