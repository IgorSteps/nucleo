import Shader from "../gl/shader";
import SimObject from "./simObject";

export default class Scene {
    private m_RootObj: SimObject;
    
    constructor() {
        this.m_RootObj = new SimObject(0, "__ROOT__", this)
    }

    public get root(): SimObject {
        return this.m_RootObj;
    }

    public get isLoaded(): boolean {
        return this.m_RootObj.isLoaded;
    }

    public addObject(obj: SimObject): void {
        this.m_RootObj.addChild(obj);
    }

    public getObjectByName(name: string): SimObject {
       return this.m_RootObj.getObjectByName(name);
    }

    public load(): void {
        this.m_RootObj.load();
    }

    public update(dt: number): void {
        this.m_RootObj.update(dt);
    }

    public render(shader: Shader): void {
        this.m_RootObj.render(shader);
    }

}