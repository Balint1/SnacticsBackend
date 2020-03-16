import { ISystem } from "./ISystem";

export class DynamicsSystem implements ISystem{
    calculateNextState: (entity: import("../Entity").Entity[]) => void;

}