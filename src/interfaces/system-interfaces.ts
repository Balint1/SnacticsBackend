import { Entity } from "../entities/entity";

export interface ISystem {
    calculateNextState: (entity: Entity[]) => void;
}