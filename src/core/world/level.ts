import Shader from "../gl/shader";
import Scene from "./scene";

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

}