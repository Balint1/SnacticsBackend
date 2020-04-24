import "reflect-metadata";
import { BaseComponent } from "../components/base-component";



export function getDecorators(target: any, propertyName: string | symbol): string[] {
    // get info about keys that used in current property
    const keys: any[] = Reflect.getMetadataKeys(target, propertyName);
    return keys
        // filter your custom decorators
        .filter(key => key.toString().startsWith("custom:annotations"))
        .reduce((values, key) => {
            // get metadata value.
            const currValues = Reflect.getMetadata(key, target, propertyName);
            return values.concat(currValues);
        }, []);
}

export function SocketData(subProperty: string = "") {
    return Reflect.metadata("custom:annotations:socketData", "SocketData:" + subProperty);
}