import { getDecorators } from "./decorators";
import { HelperConstants } from "../constants";

export abstract class Serializable{
    serialize(): object{
        var properties = Object.getOwnPropertyNames(this)
        var data: {[k: string]: any} = {}
        properties.forEach(p => {
            if(getDecorators(this, p).includes(HelperConstants.SocketData))
                data[p] = this[p]
        });
        return data
    }
}