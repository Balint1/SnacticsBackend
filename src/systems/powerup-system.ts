import { BaseSystem } from "./base-system";
import { config } from "node-config-ts";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";
import { getRandomPowerUp } from "../helpers/powerUp-helper";
import { PowerupFactory } from "../factory/PowerupFactory";

export class PowerupSystem extends BaseSystem { 
    spawnTimer: number = 0
    factory = new PowerupFactory(this.entityPool)

    calculateNextState(idle: number): void {
        this.entityPool.playerManager.forEach(player => {
            // Update the state of power-ups on players
            player.powerups.forEach(powerup => {
                if(powerup.activationStatus == PowerupActivationStatusType.Activated){
                    if(powerup.expiration == idle){
                        powerup.deactivate()
                    }
                }
                else {
                    //Set expiration time and activate
                    if(powerup.activationStatus == PowerupActivationStatusType.AutoTriggered || powerup.activationStatus == PowerupActivationStatusType.UserTriggered)
                        powerup.activate((idle + config.PowerupDefaults.InstantPowerUpTimeout) % config.ServerSettings.idleReset)
                }

            });

            player.powerups = player.powerups.filter(p => p.expiration != idle)
        });

        // Spawn new powerups
        if(this.spawnTimer == 0) {
            this.entityPool.addEntity(this.factory.create())
            this.spawnTimer = config.PowerupDefaults.spawningInterval
        }
        this.spawnTimer--;
    }

}