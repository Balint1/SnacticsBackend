import { ISystem } from "../interfaces/system-interfaces";

export class UserInputSystem implements ISystem {
    calculateNextState: (entity: import("../entities/entity").Entity[]) => void;

}