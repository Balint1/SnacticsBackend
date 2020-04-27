import {BaseSystem} from "./base-system";
import {SnakeComponent} from "../components/snake-component";
import {EntityPool} from "../entities/entity-pool";
import {config} from 'node-config-ts'
import {ISettings} from "../interfaces/game-interfaces";
import {Game} from "../game";
import {TagType} from "../Enums/tag-type";


export class DynamicsSystem extends BaseSystem {
    private setting: ISettings;

    constructor(game: Game, entityPool:EntityPool, setting:ISettings){
        super(game, entityPool)
        this.setting = setting
    }

    calculateNextState(idle:number) {
        this.entityPool.movementManager.forEach(c => {
            let position = this.entityPool.positionManager.get(c.entityId)
            let entity = this.entityPool.entities.get(c.entityId);
            let snake = this.entityPool.tagManager.get(entity.id);
            
            if(snake.tag != TagType.SnakeHead){
                position.position.x += c.direction.x * c.speed
                position.position.y += c.direction.y * c.speed
                console.log(`pos x: ${position.position.x} pos y: ${position.position.y}`)
                position.setChanged()
            }

            if(snake.tag == TagType.SnakeHead && idle % c.speed == 0){
                let player = this.entityPool.playerManager.get(entity.id)
                if(!player.alive)
                    return;

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

                // Move the head position in the proper direction
                position.position.x += c.direction.x
                position.position.y += c.direction.y 
                    
                // Move to opposite side when going through a wall
                let collider = this.entityPool.colliderManager.get(entity.id)
                if(!collider.collideWithWalls) {
                    if(position.position.x < 0)
                        position.position.x += config.ServerSettings.fieldWidth
                    if(position.position.y < 0)
                        position.position.y += config.ServerSettings.fieldHeight
                    position.position.x %= config.ServerSettings.fieldWidth + 1
                    position.position.y %= config.ServerSettings.fieldHeight + 1
                }

                position.setChanged()

                tailSnakeComponent.next = secondSnakeComponent
                tailSnakeComponent.setChanged()
                head.next = tailSnakeComponent
                head.setChanged()
                beforeTailSnakeComponent.next = undefined
                beforeTailSnakeComponent.setChanged()
            }
        });
    }

}