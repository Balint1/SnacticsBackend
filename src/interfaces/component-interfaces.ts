import { ComponentType } from "../enums/component-type";

export interface IComponent {
  getComponentType: () => ComponentType;

}