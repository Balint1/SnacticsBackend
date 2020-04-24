import {getDecorators, SocketData} from "./decorators";
import {HelperConstants, SnakeConstants} from "../constants";

export abstract class Serializable {
    serialize(): object {
        let properties = Object.getOwnPropertyNames(this)
        let data: { [k: string]: any } = {}
        let socketDataProperties = properties.filter(p => getDecorators(this, p).filter(d => d.startsWith(HelperConstants.SocketData)).length > 0 )
        
        //TODO maybe introduce a new decorator for this
        if(socketDataProperties.filter(p => p != "entityId" && p != "componentType").length == 0)
            return undefined

        socketDataProperties.forEach(p => {
            let decorators = getDecorators(this, p).filter(d => d.startsWith(HelperConstants.SocketData))
            let hasSubProperty = false
            decorators.forEach(d => {
                let subProperty = d.slice("SocketData:".length)
                if(subProperty?.length > 1){
                    if(this[p])
                        data[p + "_" + subProperty] = this[p][subProperty]
                    else
                        data[p + "_" + subProperty] = null

                    hasSubProperty = true
                }
            });
            if(!hasSubProperty)
            data[p] = this[p]
        });
        
        return data
    }
}