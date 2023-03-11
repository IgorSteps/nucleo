import Shader from "../gl/shader";
import SimObject from "../world/simObject";
import { IComponent } from "./IComponent";
import { IComponentData } from "./IComponentData";

export default abstract class Component implements IComponent{

    protected m_Owner: SimObject;
    protected m_Data: IComponentData;

    public name: string;

    constructor(data: IComponentData) {
        this.m_Data = data;
        this.name = data.name;

    }

    public get owner(): SimObject {
        return this.m_Owner;
    }

    public setOwner(owner: SimObject) {
        this.m_Owner = owner;
    }

    public load(): void {}

    public updateReady(): void {}
    public update(dt: number): void {}
    public render(shader: Shader): void {}

}