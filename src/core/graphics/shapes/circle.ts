import { vec2 } from "gl-matrix";
import IShape from "./IShape";
import Rectangle from "./rectangle";

export default class Circle implements IShape {
    public position: vec2 = vec2.create();
    public origin: vec2 = vec2.create();
    public radius: number;


    public get offset(): vec2 {
        return vec2.fromValues( this.radius + ( this.radius * this.origin[0] ), this.radius + ( this.radius * this.origin[1] ) );
    }

    public setFromJson(json: any): void {
        if(json.position !== undefined) {
            vec2.set(this.position, json.position.x, json.position.y);
        }

        if(json.origin !== undefined) {
            vec2.set(this.origin, json.origin.x, json.origin.y);
        }

        if(json.radius === undefined) {
            throw new Error("Radius is missing width")
        }
        this.radius = Number(json.radius)

       
    }

    public intersects(other: IShape): boolean {
        if(other instanceof Circle) {
            let dist = Math.abs(Math.sqrt(vec2.sqrDist(other.position, this.position)));
            let radiusLength = this.radius + other.radius;
            if(dist <= radiusLength){
                return true;
            }
        }

        if ( other instanceof Rectangle ) {
            let deltaX = this.position[0] - Math.max( other.position[0], Math.min( this.position[0], other.position[0] + other.width ) );
            let deltaY = this.position[1] - Math.max( other.position[1], Math.min( this.position[1], other.position[1] + other.height ) );
            if ((deltaX * deltaX + deltaY * deltaY) < (this.radius * this.radius)) {
                return true;
            }
        }

        return false;
    }

    public pointInShape(point: vec2): boolean {
        let dist = Math.abs(Math.sqrt(vec2.sqrDist(point, this.position)));
        if(dist <= this.radius) {
            return true;
        }

        return false;
    }

}