import { vec2 } from "gl-matrix";
import IShape from "./IShape";
import Rectangle from "./rectangle";

export default class Circle implements IShape {
    public position: vec2 = vec2.create();
    public offset: vec2 = vec2.create();
    public radius: number;


    public setFromJson(json: any): void {
        if(json.position !== undefined) {
            vec2.set(this.position, json.position.x, json.position.y);
        }

        if(json.offset !== undefined) {
            vec2.set(this.offset, json.offset.x, json.offset.y);
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
            if ( this.pointInShape(other.position ) ||
                this.pointInShape(vec2.set(vec2.create(), other.position[0] + other.width, other.position[1] ) ) ||
                this.pointInShape(vec2.set(vec2.create(),other.position[0] + other.width, other.position[1] + other.height ) ) ||
                this.pointInShape(vec2.set(vec2.create(),other.position[0], other.position[1] + other.height ) ) ) {
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