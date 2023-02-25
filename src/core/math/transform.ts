import { mat4, vec3 } from "gl-matrix";

export default class Transform {

    public Position: vec3 = vec3.create();
    public Rotation: number = 0;
    public Scale: vec3 = vec3.set(vec3.create(), 1, 1, 1);
    

    public copyFrom(transform: Transform): void {
        vec3.copy(this.Position, transform.Position);
        this.Rotation = transform.Rotation;
        vec3.copy(this.Scale, transform.Scale);
    } 

    public getTransformationMatrix(): mat4 {

        let model = mat4.translate(mat4.create(), mat4.create(), this.Position);
        mat4.rotateZ(model, model, this.Rotation);
        mat4.scale(model, model, this.Scale);

        return model;
    }

}