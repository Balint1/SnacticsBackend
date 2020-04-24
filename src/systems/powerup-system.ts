import { BaseSystem } from "./base-system";
import { config } from "node-config-ts";
import { PowerupActivationStatusType } from "../Enums/powerup-activation-state-type";

export class PowerupSystem extends BaseSystem{
    calculateNextState(idle: number): void {
        this.entityPool.playerManager.forEach(player => {
            player.powerups.forEach(powerup => {
                if(powerup.activationStatus == PowerupActivationStatusType.Activated){
                    if(powerup.expiration == idle){
                        powerup.deactivate()
                    }
                }
                else{
                    //Set expiration time and activate
                    if(powerup.activationStatus == PowerupActivationStatusType.AutoTriggered || powerup.activationStatus == PowerupActivationStatusType.UserTriggered)
                        powerup.activate((idle + config.PowerupDefaults.InstantPowerUpTimeout) % config.ServerSettings.idleReset)
                }

            });

            player.powerups = player.powerups.filter(p => p.expiration != idle)
        });
    }

}