import {BaseSystem} from "./base-system";
import { SnakeComponent } from "../components/snake-component";
import { EntityPool } from "../entities/entity-pool";
import { GameSetting, Setting } from "../models/game-setting";
import {config} from 'node-config-ts'


export class DynamicsSystem extends BaseSystem {
    private setting: Setting;

    constructor(entityPool:EntityPool, setting:Setting){
        super(entityPool)
        this.setting = setting
    }

    calculateNextState(idle:number) {
        this.entityPool.movementManager.forEach(c => {
            
            let position = this.entityPool.positionManager.get(c.entityId)
            let entity = this.entityPool.entities.get(c.entityId);
            let snake = this.entityPool.tagManager.get(entity.id);

            if(snake && idle % c.speed == 0){

                let head = this.entityPool.snakeManager.get(entity.id);

                let tailSnakeComponent = head;
                let beforeTailSnakeComponent: SnakeComponent = null;
                let secondSnakeComponent = head.next;

                //Get the tail of the snake
                while(tailSnakeComponent.next){
                    beforeTailSnakeComponent = tailSnakeComponent
                    tailSnakeComponent = tailSnakeComponent.next
                }

                //Set tail position to the second position of the snake
                let tailPosition = this.entityPool.positionManager.get(tailSnakeComponent.entityId);
                tailPosition.position.x = position.position.x
                tailPosition.position.y = position.position.y
                tailPosition.setChanged()

                //Set the head position to the proper direction
                position.position.x = position.position.x + c.direction.x >= 0 
                    ? (position.position.x + c.direction.x) % config.ServerSettings.fieldWidth 
                    : config.ServerSettings.fieldWidth + position.position.x + c.direction.x
                position.position.y = position.position.y + c.direction.y >= 0 
                    ? (position.position.y + c.direction.y) % config.ServerSettings.fieldHeight 
                    : config.ServerSettings.fieldHeight + position.position.y + c.direction.y
                position.setChanged()

                tailSnakeComponent.next = secondSnakeComponent
                tailSnakeComponent.setChanged()
                head.next = tailSnakeComponent
                head.next.setChanged()
                beforeTailSnakeComponent.next = undefined
                beforeTailSnakeComponent.setChanged()

            }
        });
    }

}