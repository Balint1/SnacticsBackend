import { ISystem } from "./ISystem";

export class UserInputSystem implements ISystem{
    calculateNextState: (entity: import("../Entity").Entity[]) => void;

}