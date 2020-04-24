import {BaseComponent} from "../components/base-component";
import {Guid} from "guid-typescript";

export class Entity {
    constructor() {

    }

    id: string = Guid.raw()
    components: BaseComponent[] = []

    addComponent(component: BaseComponent) {
        component.entityId = this.id
        this.components.push(component)
    }
}