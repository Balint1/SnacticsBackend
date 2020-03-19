import { Entity } from "../entity";

export interface ISystem {
    calculateNextState: (entity: Entity[]) => void;
}