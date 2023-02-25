import Shader from "../gl/shader";
import SimObject from "../world/simObject";

export default abstract class Component {

    protected m_Owner: SimObject;

    public Name: string;

    constructor(name: string) {

    }

    public get owner(): SimObject {
        return this.m_Owner;
    }

    public setOwner(owner: SimObject) {
        this.m_Owner = owner;
    }

    public load(): void {
        
    }
    public update(dt: number): void {}
    public render(shader: Shader): void {}

}