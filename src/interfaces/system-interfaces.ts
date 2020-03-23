import {Entity} from "../entities/entity";
import {EntityPool} from "../entities/entity-pool";

export interface ISystem {
    calculateNextState(): void;
}