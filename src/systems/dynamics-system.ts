import {BaseSystem} from "./base-system";
import {GameConstants} from "../constants";
import { SnakeComponent } from "../components/snake-component";

export class DynamicsSystem extends BaseSystem {
    counter:number = 0

    calculateNextState() {
        this.entityPool.movementManager.forEach(c => {
            
            let position = this.entityPool.positionManager.get(c.entityId)
            let entity = this.entityPool.entities.get(c.entityId);
            let snake = this.entityPool.tagManager.get(entity.id);

            if(snake && this.counter % c.speed == 0){

                let head = this.entityPool.snakeManager.get(entity.id);

                let tailSnakeComponent = head;
                let beforeTailSnakeComponent: SnakeComponent = null;
                let secondSnakeComponent = head.next;

                while(tailSnakeComponent.next){
                    beforeTailSnakeComponent = tailSnakeComponent
                    tailSnakeComponent = tailSnakeComponent.next
                }

                let tailPosition = this.entityPool.positionManager.get(tailSnakeComponent.entityId);
                tailPosition.position.x = position.position.x
                tailPosition.position.y = position.position.y

                position.position.x = (position.position.x + c.direction.x) % GameConstants.fieldWidth
                position.position.y = (position.position.y + c.direction.y) % GameConstants.fieldHeight

                tailSnakeComponent.next = secondSnakeComponent
                head.next = tailSnakeComponent
                beforeTailSnakeComponent.next = undefined

            }

            //Sometimes we have to reset the counter, this number won't break the rest ( % ) operation 
            this.counter = this.counter == 362880 ? 0 : this.counter + 1
        });
    }

}