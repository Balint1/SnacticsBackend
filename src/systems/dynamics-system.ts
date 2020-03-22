import { ISystem } from "../interfaces/system-interfaces";
import { Entity } from "../entities/entity";
import { ComponentType } from "../enums/component-type";
import { BaseSystem } from "./base-system";
import { GameConstants } from "../constants";

export class DynamicsSystem extends BaseSystem {
    calculateNextState (){        
        this.entityPool.movementManager.forEach(c => {
            var position = this.entityPool.positionManager.find(p => p.entityId == c.entityId)
            
            position.x = (position.x + c.x) % GameConstants.fieldWidth
            position.y = (position.y + c.y) % GameConstants.fieldHeight

        });
    }

}