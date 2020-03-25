import {ISystem} from "../interfaces/system-interfaces";
import {Entity} from "../entities/entity";
import {ComponentType} from "../enums/component-type";
import {BaseSystem} from "./base-system";
import {GameConstants} from "../constants";
import { TagType } from "../Enums/tag-type";
import { SnakeComponent } from "../components/snake-component";

export class DynamicsSystem extends BaseSystem {
    counter:number = 0

    calculateNextState() {
        this.entityPool.movementManager.forEach(c => {
            
            let position = this.entityPool.positionManager.get(c.entityId)
            var entity = this.entityPool.entities.get(c.entityId)
            var snake = this.entityPool.tagManager.get(entity.id)

            if(snake && this.counter % c.speed == 0){

                var head = this.entityPool.snakeManager.get(entity.id)

                var tailSnakeComponent = head
                var beforeTailSnakeComponent:SnakeComponent = null
                var secondSnakeComponent = head.next

                while(tailSnakeComponent.next){
                    beforeTailSnakeComponent = tailSnakeComponent
                    tailSnakeComponent = tailSnakeComponent.next
                }

                var tailPosition = this.entityPool.positionManager.get(tailSnakeComponent.entityId)
                tailPosition.position.x = position.position.x
                tailPosition.position.y = position.position.y

                position.position.x = (position.position.x + c.direction.x) % GameConstants.fieldWidth
                position.position.y = (position.position.y + c.direction.y) % GameConstants.fieldHeight

                tailSnakeComponent.next = secondSnakeComponent
                head.next = tailSnakeComponent
                beforeTailSnakeComponent.next = undefined

            }
            
            this.counter = this.counter == 362880 ? 0 : this.counter + 1
        });
    }

}