import { vec2 } from "gl-matrix";

export default interface IShape {
    position: vec2;
    origin: vec2;
    readonly offset: vec2;        
    setFromJson(json: any): void;
    intersects(shape: IShape): boolean;
    pointInShape(point: vec2): boolean;
}