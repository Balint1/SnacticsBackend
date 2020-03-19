import { JsonController, OnUndefined, Param, Body, Get, Post, Put, Delete } from "routing-controllers";
import { Game } from "./Game";
import { GameConstants } from "./Constants";

@JsonController("/Rooms")
export class RoomController {

  game: Game = new Game()

  constructor() {
    
  }
  @Get("/create")
  createRoom() {
    console.log("Room creation")
    this.game.startGame()
    return {response : "Game Started"}

  }

  @Get()
  getAllRooms() {
    console.log("ListRooms")
    return this.game.counter
  }

  @Get("/stop")
  getStop() {
    this.game.endGame()
    console.log("ListRooms")
    return {response : "Game ended"}
  }



 
}