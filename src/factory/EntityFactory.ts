import {Entity} from "../entities/entity";

export abstract class EntityFactory {
    public abstract create(): Entity
}