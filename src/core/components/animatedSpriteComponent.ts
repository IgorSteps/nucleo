/// <reference path="componentmanager.ts" />

import { vec3 } from "gl-matrix";
import Shader from "../gl/shader";
import AnimatedSprite from "../graphics/animatedSprite";
import Sprite from "../graphics/sprite";
import Component from "./component";
import { ComponentManager } from "./componentManager";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";
import { SpriteComponentData } from "./spriteComponent";

export class AnimatedSpriteComponentData extends SpriteComponentData implements IComponentData{

    public FrameWidth: number;
    public FrameHeight: number;
    public FrameCount: number;
    public FrameSequence: number[] = [];
    public AutoPlay: boolean = true;

    public setFromJson(json: any): void {
        super.setFromJson(json);


        if(json.FrameWidth === undefined){
            throw new Error("AnimatedSpriteComponent is missng FrameWidth");
        } else {
            this.FrameWidth = Number(json.FrameWidth);
        }

        if(json.FrameHeight === undefined){
            throw new Error("AnimatedSpriteComponent is missng FrameHeight");
        } else {
                this.FrameHeight = Number(json.FrameHeight);
        }

        if(json.FrameCount === undefined){
            throw new Error("AnimatedSpriteComponent is missng FrameCount");
        } else {
            this.FrameCount = Number(json.FrameCount);
        }

        if(json.FrameSequence === undefined){
            throw new Error("AnimatedSpriteComponent is missng FrameSequence");
        } else {
            this.FrameSequence = json.FrameSequence;
        }

        if(json.AutoPlay !== undefined){
            this.AutoPlay = Boolean(json.AutoPlay);
        }
        
    }
}

export class AnimatedSpriteComponentBuilder implements IComponentBuilder {
    public get type(): string {
        return "animatedSprite"
    }

    public buildFromJson(json: any): IComponent {
        let data = new AnimatedSpriteComponentData();
        data.setFromJson(json);
        return new AnimatedSpriteComponent(data);
    }

}

export default class AnimatedSpriteComponent extends Component {
    private m_AutoPlay: boolean;
    private m_Sprite: AnimatedSprite;

    constructor(data: AnimatedSpriteComponentData) {
        super(data);

        this.m_AutoPlay = data.AutoPlay;
        this.m_Sprite = new AnimatedSprite(this.name, data.materialName, data.FrameWidth, data.FrameHeight,
             data.FrameWidth, data.FrameHeight, data.FrameCount, data.FrameSequence);
        if(!vec3.equals(vec3.create(), data.origin)) {
            vec3.set(this.m_Sprite.origin, data.origin[0], data.origin[1], data.origin[2]);
        }
    }

    public isPlaying(): boolean {
        return this.m_Sprite.isPlaying;
    }

    public load(): void {
        this.m_Sprite.load();    
    }

    public updateReady(): void {
        if(!this.m_AutoPlay) {
            this.m_Sprite.stop();
        }
    }

    public update(dt: number): void {
        super.update(dt);

        this.m_Sprite.update(dt);
    }

    public render(shader: Shader): void {
        this.m_Sprite.draw(shader, this.m_Owner.worldMatrix);

       
        super.render(shader);
    }

    public play(): void {
        this.m_Sprite.play();
    }

    public stop(): void {
        this.m_Sprite.stop();
    }

    public setFrame(frameNum: number): void {
       this.m_Sprite.setFrame(frameNum);
    }
}
