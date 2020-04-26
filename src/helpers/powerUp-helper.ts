import {config} from 'node-config-ts'
import { PowerupType } from '../Enums/powerup-type'

export function getRandomPowerUp() {
    let table = config.PowerupDefaults.powerUpTable
    let sumWeight = table.reduce((a, b) => a + (b["weight"] || 0), 0)
    let randomNumber = Math.random() * sumWeight

    let currentWeight = 0

    for(let i = 0; i < table.length; i++){
        currentWeight += table[i].weight
        if(randomNumber < currentWeight)
            return PowerupType[table[i].powerUp]
    }

    return PowerupType.SpeedBooster
}