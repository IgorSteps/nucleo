import { vec2 } from "gl-matrix";

export default interface IShape {
    position: vec2;
    offset: vec2;         // @TODO: hacky way to fix problem with collisions and origins - remove
    setFromJson(json: any): void;
    intersects(shape: IShape): boolean;
    pointInShape(point: vec2): boolean;
}