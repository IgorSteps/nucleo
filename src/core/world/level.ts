import { BehaviourManager } from "../behaviours/behaviourManager";
import { ComponentManager } from "../components/componentManager";
import Shader from "../gl/shader";
import Scene from "./scene";
import SimObject from "./simObject";

export enum LevelState {
    UNINITILISED,
    LOADING,
    UPDATING
}

export default class Level {
    private m_Id: number;
    private m_Name: string;
    private m_Descritpion: string;
    private m_Scene: Scene;
    private m_State: LevelState = LevelState.UNINITILISED;
    private m_GlobalId: number = -1;

    constructor(id: number, name: string, description: string) {
        this.m_Id = id;
        this.m_Descritpion = description;
        this.m_Name = name;
        this.m_Scene = new Scene();
    }

    public get id(): number {
        return this.m_Id;
    }

    public get name(): string {
        return this.m_Name;
    }

    public get description(): string {
        return this.m_Descritpion;
    }

    public get scene(): Scene {
        return this.m_Scene;
    }

    public init(levelData: any): void {
        if(levelData.objects === undefined) {
            throw new Error("Level init error: objects are missing");
        }

        for(let o in levelData.objects) {
            let obj = levelData.objects[o];

            this.loadSimObject(obj, this.m_Scene.root);
        }
    }

    public load(): void {
        this.m_State = LevelState.LOADING;

        this.m_Scene.load()

        this.m_State = LevelState.UPDATING;
    }

    public unload(): void {
    
    }

    public update(dt: number): void {
        if(this.m_State === LevelState.UPDATING){
            this.m_Scene.update(dt);
        }
    }

    public render(shader: Shader): void {
        if(this.m_State === LevelState.UPDATING){
            this.m_Scene.render(shader);
        }   
    }


    public onActivated(): void {}
    public onDeactived(): void {}

    private loadSimObject(dataSection: any, parent: SimObject): void {
        let name:string;
        if(dataSection.name !== undefined) {
            name = String(dataSection.name);
        }

        this.m_GlobalId++;
        let simObject = new SimObject(this.m_GlobalId, name, this.m_Scene);
        
        if(dataSection.transform !== undefined) {
            simObject.Transform.setFromJson(dataSection.transform);
        }

        if(dataSection.components !== undefined) {
            for (let c in dataSection.components) {
                let data = dataSection.components[c];
                let component = ComponentManager.extractComponent(data);
                simObject.addComponent(component);
            }
        }

        if(dataSection.behaviours !== undefined) {
            for (let b in dataSection.behaviours) {
                let data = dataSection.behaviours[b];
                let behaviour = BehaviourManager.extractBehaviour(data);
                simObject.addBehaviour(behaviour);
            }
        }
        
        if(dataSection.children !== undefined) {
            for(let o in dataSection.children) {
                let obj = dataSection.children[o];
                this.loadSimObject(obj, simObject);
            }
        }

        if(parent !== undefined) {
            parent.addChild(simObject);
        }

    }

}