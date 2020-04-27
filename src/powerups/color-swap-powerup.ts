import { PowerupType } from "../Enums/powerup-type";
import { IPowerup } from "./powerup-interface";
import { EntityPool } from "../entities/entity-pool";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";
import { ActivationType } from "../Enums/activation-type";
import { BlueSnakePowerup } from "./blue-snake-constant-powerup";
import { GreenSnakePowerup } from "./green-snake-constant-powerup";
import { SnakeColorType } from "../Enums/snake-color-type";
import { PowerupFactory } from "../factory/PowerupFactory";

export class ColorSwapPowerUp implements IPowerup{
    type:PowerupType
    activationStatus = PowerupActivationStatusType.AutoTriggered
    expiration: number
    playerEntityId: string
    entityPool: EntityPool
    activationType: ActivationType = ActivationType.Auto


    constructor(entityPool:EntityPool, playerEntityId:string){
        this.type = PowerupType.ColorSwap
        this.entityPool = entityPool
        this.playerEntityId = playerEntityId
    }
    activate(expiration:number): void {
        let playerComponent = this.entityPool.playerManager.get(this.playerEntityId)
        let activeColorPowerups = playerComponent.powerups.filter(p => (p.type == PowerupType.BlueSnake || p.type == PowerupType.GreenSnake) && p.activationStatus == PowerupActivationStatusType.Activated)
        this.expiration = -1
        this.activationStatus = PowerupActivationStatusType.Activated
        for(let i=0;i<activeColorPowerups.length ;i++) {
            activeColorPowerups[i].deactivate()
        }
        if(playerComponent.color == SnakeColorType.BlueSnake) {
            playerComponent.color = SnakeColorType.GreenSnake
            let greenSnakePowerup = new GreenSnakePowerup(this.entityPool, this.playerEntityId)
            playerComponent.powerups.push(greenSnakePowerup)
            // greenSnakePowerup.activate(-1)
            playerComponent.setChanged()
        } else if(playerComponent.color == SnakeColorType.GreenSnake) {
            playerComponent.color = SnakeColorType.BlueSnake
            let blueSnakePowerup = new BlueSnakePowerup(this.entityPool, this.playerEntityId)
            playerComponent.powerups.push(blueSnakePowerup)
            // blueSnakePowerup.activate(-1)
            playerComponent.setChanged()
        }
        this.deactivate()
    }

    deactivate(): void {
        this.activationStatus = PowerupActivationStatusType.Used
    } 
}
