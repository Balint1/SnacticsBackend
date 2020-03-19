import { ISystem } from "./system-interfaces";

export class UserInputSystem implements ISystem {
    calculateNextState: (entity: import("../entity").Entity[]) => void;

}