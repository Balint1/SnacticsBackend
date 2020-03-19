import { JsonController, OnUndefined, Param, Body, Get, Post, Put, Delete } from "routing-controllers";

@JsonController("/Rooms")
export class RoomController {

  constructor() {
    
  }
  @Post("/create")
  createRoom() {
    console.log("Room creation")
    return "Implement it"
  }

  @Get()
  getAllRooms() {
    console.log("ListRooms")
    return "Implement it"
  }



 
}