import { vec2, vec3 } from "gl-matrix";

export default class Vertex {
    public Position: vec3 = vec3.create();
    public TexCoords: vec2 = vec2.create();

    constructor(x: number = 0, y: number = 0, z: number = 0, tu: number = 0, tv: number = 0) {
        vec3.set(this.Position, x, y, z);
        vec2.set(this.TexCoords, tu, tv);

    }

    public toArray(): number[] {
        let outArray: number[] = [];
        
        let a: number[] = [];
        a = [this.Position[0], this.Position[1], this.Position[2]];
        outArray = outArray.concat(a);

        let b : number[] = [];
        b = [this.TexCoords[0],this.TexCoords[1]];
        outArray = outArray.concat(b);

        return outArray;
    }

    public toFloat32Arr() {
        return new Float32Array(this.toArray());

    }
}