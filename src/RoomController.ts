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
    return { response: "Game Started" }

  }

  @Get()
  getAllRooms() {
    return this.game.counter
  }

  @Get("/stop")
  getStop() {
    this.game.endGame()
    return { response: "Game ended" }
  }




}