import { ComponentType } from "../enums/component-type";
import { BaseComponent } from "./base-component";
import { TagType } from "../Enums/tag-type";
import { SocketData } from "../helpers/decorators";

export class TagComponent extends BaseComponent{
        constructor(tag:TagType) {
            super()
            this.componentType = ComponentType.Tag
            this.tag = tag
        }
        @SocketData()
        tag:TagType
}