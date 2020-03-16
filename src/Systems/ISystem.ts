import { Entity } from "../Entity";

export interface ISystem{
    calculateNextState: (entity: Entity[]) => void;
}