import { mat4, vec3 } from "gl-matrix";
import { re } from "mathjs";
import { IBehaviour } from "../behaviours/IBehaviour";
import Component from "../components/component";
import { IComponent } from "../components/IComponent";
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
    private m_Visible: boolean = true;

    private m_Components: IComponent[] = [];
    private m_Behaviours: IBehaviour[] = [];

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

    public get isVisible(): boolean {
        return this.m_Visible;
    }

    public set isVisible(v: boolean) {
        this.m_Visible = v;
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

    public getComponentByName(name: string): IComponent {
        for(let c of this.m_Components) {
            if(c.name === name) {
                return c;
            }
        }

        for(let child of this.m_Children) {
            let component = child.getComponentByName(name);
            if( component !== undefined) {
                return component;
            }
        }

        return undefined;
    }

    public getBehaviourByName(name: string): IBehaviour {
        for(let b of this.m_Behaviours) {
            if(b.name === name) {
                return b;
            }
        }

        for(let child of this.m_Children) {
            let behaviour = child.getBehaviourByName(name);
            if( behaviour !== undefined) {
                return behaviour;
            }
        }

        return undefined;
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

    public addComponent(component: IComponent): void {
        this.m_Components.push(component);
        component.setOwner(this);
    }

    public addBehaviour(behaviour: IBehaviour): void {
        this.m_Behaviours.push(behaviour);
        behaviour.setOwner(this);
    }

    public load(): void {
        this.m_IsLoaded = true;

        for (let c of this.m_Components) {
            c.load();
        }

        for(let c of this.m_Children) {
            c.load()
        }
    }

    public updateReady(): void {
        for (let c of this.m_Components) {
            c.updateReady();
        }

        for (let b of this.m_Behaviours) {
            b.updateReady();
        }

        for(let c of this.m_Children) {
            c.updateReady()
        }
    }


    public update(dt: number): void {

        this.m_LocalMatrix = this.Transform.getTransformationMatrix();
        this.updateWorldMatrix((this.m_Parent !== undefined) ? this.m_Parent.worldMatrix : undefined);

        for (let c of this.m_Components) {
            c.update(dt);
        }

        for (let b of this.m_Behaviours) {
            b.update(dt);
        }

        for(let c of this.m_Children) {
            c.update(dt)
        }
    }

    public render(shader: Shader): void {
        if(!this.m_Visible) {
            return;
        }
        
        for (let c of this.m_Components) {
            c.render(shader);
        }

        for(let c of this.m_Children) {
            c.render(shader)
        }
    }

     /** Returns the world position of this entity. */
     public getWorldPosition(): vec3 {
        return vec3.fromValues(this.m_WorldMatrix[12], this.m_WorldMatrix[13], this.m_WorldMatrix[14])
    }


    private updateWorldMatrix(parentWorldMatrix: mat4) {
        if(parentWorldMatrix !== undefined) {
            mat4.multiply(this.worldMatrix, parentWorldMatrix, this.m_LocalMatrix);
        } else {
            mat4.copy(this.m_WorldMatrix, this.m_LocalMatrix);
        }


    }


    protected onAdded(scene: Scene) {
        this.m_Scene = scene;
    }


}