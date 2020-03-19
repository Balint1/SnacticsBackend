import { ComponentType } from "../enums/componentType";

export interface IComponent {
  getComponentType: () => ComponentType;

}