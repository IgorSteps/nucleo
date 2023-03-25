import { vec2 } from "gl-matrix";
import Circle from "./circle";
import IShape from "./IShape";

export default class Rectangle implements IShape{
    public position: vec2 = vec2.create();
    public origin: vec2 = vec2.create();

    public width: number;
    public height: number;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.position[0] = x;
        this.position[1] = y;
        this.width = width;
        this.height = height;
    }

    public get offset(): vec2 {
        return vec2.fromValues( ( this.width * this.origin[0] ), ( this.height * this.origin[1] ) );
    }

    public setFromJson(json: any): void {
        if(json.position !== undefined) {
            vec2.set(this.position, json.position.x, json.position.y);
        }

        if(json.origin !== undefined) {
            vec2.set(this.origin, json.origin.x, json.origin.y);
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
            let a = this.getExtents(this);
            let b = this.getExtents(other);

            return (a.position[0] <= b.width && a.width >= b.position[0]) && (a.position[1] <= b.height && a.height >= b.position[1]);
        }

        if(other instanceof Circle) {
            let deltaX = other.position[0] - Math.max( this.position[0], Math.min( other.position[0], this.position[0] + this.width ) );
            let deltaY = other.position[1] - Math.max( this.position[1], Math.min( other.position[1], this.position[1] + this.height ) );
            if ( ( deltaX * deltaX + deltaY * deltaY ) < ( other.radius * other.radius ) ) {
                 return true;
             }
         }

        return false;
    }

    public pointInShape(point: vec2): boolean {
        let x = this.width < 0 ? this.position[0] - this.width : this.position[0];
        let y = this.height < 0 ? this.position[1] - this.height : this.position[1];

        let extentX = this.width < 0 ? this.position[0] : this.position[0] + this.width;
        let extentY = this.height < 0 ? this.position[1] : this.position[1] + this.height;

        if(point[0] >= x && point[0] <= extentX && point[1] >= y && point[1] <= extentY ) {
            return true;
        }

        return false;
    }

    private getExtents(shape: Rectangle): Rectangle {
        let x = shape.width < 0 ? shape.position[0] - shape.width : shape.position[0];
        let y = shape.height < 0 ? shape.position[1] - shape.height : shape.position[1];

        let extentX = shape.width < 0 ? shape.position[0] : shape.position[0] + shape.width;
        let extentY = shape.height < 0 ? shape.position[1] : shape.position[1] + shape.height;

        return new Rectangle(x, y, extentX, extentY);
    }
}