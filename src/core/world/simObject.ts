import { mat4 } from "gl-matrix";
import { re } from "mathjs";
import Shader from "../gl/shader";
import Transform from "../math/transform";
import Scene from "./scene";

export default class SimObject {
    private m_Id: number;
    private m_Children: SimObject[] = [];
    private m_Parent: SimObject;
    private m_IsLoaded: boolean =false;
    private m_Scene: Scene; 
    private m_LocalMatrix: mat4 = mat4.create();
    private m_WorldMatrix: mat4 = mat4.create();

    public Name: string;
    public Transform: Transform = new Transform();


    constructor(id: number, name: string, scene?: Scene) {
        this.m_Id = id;
        this.Name = name;
        this.m_Scene = scene;
    }

    public get id(): number {
        return this.m_Id;
    }

    public get parent(): SimObject {
        return this.m_Parent;
    }

    public get worldMatrix(): mat4 {
        return this.m_WorldMatrix;
    }

    public get isLoaded(): boolean {
        return this.m_IsLoaded;
    }

    public addChild(child: SimObject): void {
        child.m_Parent = this;
        this.m_Children.push(child);
        child.onAdded(this.m_Scene);
    }

    public removeChild(child: SimObject): void {
        let index =this.m_Children.indexOf(child);
        if(index !== -1){
            child.m_Parent = undefined;
            this.m_Children.splice(index, 1);
        }
    }


    public getObjectByName(name: string): SimObject {
        if(this.Name === name){
            return this;
        }

        for(let child of this.m_Children) {
            let result = child.getObjectByName(name);
            if(result !== undefined) {
                return result;
            }
        }

        return undefined;
    }

    public load(): void {
        this.m_IsLoaded = true;
        for(let c of this.m_Children) {
            c.load()
        }
    }

    public update(dt: number): void {
        for(let c of this.m_Children) {
            c.update(dt)
        }
    }

    public render(shader: Shader): void {
        for(let c of this.m_Children) {
            c.render(shader)
        }
    }


    protected onAdded(scene: Scene) {
        this.m_Scene = scene;
    }


}