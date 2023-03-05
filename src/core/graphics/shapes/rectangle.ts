import { vec2 } from "gl-matrix";
import Circle from "./circle";
import IShape from "./IShape";

export default class Rectangle implements IShape{
    public position: vec2 = vec2.create();
    public offset: vec2 = vec2.create();

    public width: number;
    public height: number;

    public setFromJson(json: any): void {
        if(json.position !== undefined) {
            vec2.set(this.position, json.position.x, json.position.y);
        }

        if(json.offset !== undefined) {
            vec2.set(this.offset, json.offset.x, json.offset.y);
        }

        if(json.width === undefined) {
            throw new Error("Rectangle is missing width")
        }
        this.width = Number(json.width)

        if(json.height === undefined) {
            throw new Error("Rectangle is missing height")
        }
        this.height = Number(json.height)
    }

    public intersects(other: IShape): boolean {
        if(other instanceof Rectangle) {
           if(this.pointInShape(other.position) ||
            this.pointInShape(vec2.set(vec2.create(), other.position[0] + other.width, other.position[1])) ||
            this.pointInShape(vec2.set(vec2.create(), other.position[0] + other.width, other.position[1] + this.height)) ||
            this.pointInShape(vec2.set(vec2.create(), other.position[0], other.position[1] + this.height))) {
                return true;
            }
        }

        if(other instanceof Circle) {
            if(this.pointInShape(other.position) ||
             other.pointInShape(vec2.set(vec2.create(), this.position[0] + this.width, this.position[1])) ||
             other.pointInShape(vec2.set(vec2.create(), this.position[0] + this.width, this.position[1] + this.height)) ||
             other.pointInShape(vec2.set(vec2.create(), this.position[0], this.position[1] + this.height))) {
                 return true;
             }
         }

        return false;
    }

    public pointInShape(point: vec2): boolean {
        if(point[0] >= this.position[0] && point[0] <= this.position[0] + this.width) {
            if(point[1] >= this.position[1] && point[1] <= this.position[1] + this.height) {
                return true;
            }
        }

        return false;
    }
}