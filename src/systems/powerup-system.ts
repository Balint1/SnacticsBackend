import { BaseSystem } from "./base-system";
import { config } from "node-config-ts";

export class PowerupSystem extends BaseSystem{
    calculateNextState(idle: number): void {
        this.entityPool.playerManager.forEach(player => {
            player.powerups.forEach(powerup => {
                if(powerup.activated){
                    if(powerup.expiration == idle){
                        powerup.deactivate()
                    }
                }
                else{
                    //Set expiration time
                    powerup.activate((idle + config.PowerupDefaults.InstantPowerUpTimeout) % config.ServerSettings.idleReset)
                }

            });

            player.powerups = player.powerups.filter(p => p.expiration != idle)
        });
    }

}