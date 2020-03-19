import { ComponentType } from "../Enums/ComponentType";

export interface IComponent {
  getComponentType: () => ComponentType;
    
  }