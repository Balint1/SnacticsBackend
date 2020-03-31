import {config} from 'node-config-ts'

export class Setting{
    constructor(){

    }
    gameSetting = new GameSetting()
    snakeDefaults = new SnakeDefaults()

}

export class GameSetting {
}

export class SnakeDefaults{
    length = config.SnakeDefaults.length
    speed = config.SnakeDefaults.speed
}