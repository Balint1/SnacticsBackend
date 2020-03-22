import { ComponentType } from "../enums/component-type";
import { SocketData } from "../helpers/decorators";

export interface IComponent {
  readonly componentType: ComponentType
  entityId: string
}