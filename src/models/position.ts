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
}