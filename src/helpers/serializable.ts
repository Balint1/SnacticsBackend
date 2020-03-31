import {getDecorators} from "./decorators";
import {HelperConstants} from "../constants";

export abstract class Serializable {
    serialize(): object {
        let properties = Object.getOwnPropertyNames(this)
        let data: { [k: string]: any } = {}
        let socketDataProperties = properties.filter(p => getDecorators(this, p).includes(HelperConstants.SocketData))
        
        //TODO maybe introduce a new decorator for this
        if(socketDataProperties.filter(p => p != "entityId" && p != "componentType").length == 0)
            return undefined

        socketDataProperties.forEach(p => {
            data[p] = this[p]
        });
        
        return data
    }
}