import {ISystem} from "../interfaces/system-interfaces";
import {BaseSystem} from "./base-system";

export class UserInputSystem extends BaseSystem {
    calculateNextState: () => void;

}