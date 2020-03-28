import { ComponentType } from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { TagType } from "../Enums/tag-type";

export class TagComponent extends BaseComponent{
        constructor(tag:TagType) {
            super()
            this.componentType = ComponentType.Tag
            this.tag = tag
        }
        tag:TagType
}