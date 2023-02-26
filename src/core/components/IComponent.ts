import Shader from "../gl/shader";
import SimObject from "../world/simObject";

export interface IComponent {
    name: string;

    readonly owner: SimObject;
    setOwner(owner: SimObject): void;
   

    load(): void;
    update(dt: number): void;
    render(shader: Shader): void;
}