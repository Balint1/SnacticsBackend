import {JsonController, Body, Get, Post} from "routing-controllers";
import {getLogger} from '../loggers'

import {config} from 'node-config-ts'
import { GameManager } from "../games-manager";

const logger = getLogger('http')

@JsonController("/Admin")
export class AdminController {

    gameManager = GameManager.getInstance()

    constructor() {
    }

    @Get("/Config")
    config(){
        return config
    }

    @Get("/rooms")
    rooms(){
        let rooms = this.gameManager.rooms.map(r => ({ 
            roomId : r.id,
            name : r.name,
            players : r.players.map(p => ({ playerId : p.id, nickname : p.nickname})),
            password : r.password,
            owner : r.ownerId,
            capacity : r.capacity

        }))

        return {
            roomCount : this.gameManager.rooms.length,
            rooms : rooms
        }
    }
}