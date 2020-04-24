export class Vector2{

    constructor(x:number, y:number){
        this.x = x
        this.y = y
    }
    x:number
    y:number

    public add(p:Vector2){
        this.x += p.x
        this.y += p.y
        return this
    }

    public distance(point:Vector2){
        let xDelta = this.x - point.x
        let yDelta = this.y - point.y
        return Math.sqrt( Math.pow(xDelta, 2) + Math.pow(yDelta, 2))
    }
}