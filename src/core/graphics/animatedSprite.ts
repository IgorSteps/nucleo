import { vec2 } from "gl-matrix";
import AssetManager, { MSG_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import { ImageAsset } from "../assets/imageAssetLoader";
import IMessageHandler from "../message/IMessageHandler";
import Message from "../message/message";
import MaterialManager from "./materialManager";
import Sprite from "./sprite";

class UVInfo {
    public Min: vec2;
    public Max: vec2;

    constructor(min: vec2, max: vec2) {
        this.Max = max;
        this.Min = min;
    }
}

export default class AnimatedSprite extends Sprite implements IMessageHandler{

    private m_FrameWidth: number;
    private m_FrameHeight: number;
    private m_FrameCount: number;
    private m_FrameSequance: number[];
    // @TODO: Probalby needs to be configurable
    // Frames per second
    private m_FrameTime: number = 333;
    private m_FrameUVs: UVInfo[] = [];

    private m_CurrentFrame: number = 0;
    private m_CurrentTime: number = 0;

    private m_AssetWidth: number = 2;
    private m_AssetHeight: number = 2;
    private m_AssetLoaded: boolean = false;

    private m_IsPlaying: boolean = true;
   
    constructor(name: string, materialName: string, width: number = 100, height: number = 100,
        frameWidth: number = 10, frameHeight: number = 10,  frameCount: number = 1, frameSequance: number[]=[]) {
        super(name, materialName, width, height);

        this.m_FrameWidth = frameWidth;
        this.m_FrameHeight = frameHeight;
        this.m_FrameCount = frameCount;
        this.m_FrameSequance = frameSequance;

        Message.subscribe(MSG_ASSET_LOADER_ASSET_LOADED + this.m_Material.diffuseTexName, this);
    }

    public destroy(): void {
        super.destroy();
    }
 
    public get isPlaying() : boolean {
        return this.m_IsPlaying
    }

    public play(): void {
        this.m_IsPlaying = true;
    }

    public stop(): void {
        this.m_IsPlaying = false;
    }

    public setFrame(frameNum: number): void {
        if(frameNum >= this.m_FrameCount) {
            throw new Error("Frame is out of range: " + frameNum + ", frame count: " + this.m_FrameCount)
        }

        this.m_CurrentFrame = frameNum;
    }
    
    public onMessage(message: Message): void {
         if(message.Code === MSG_ASSET_LOADER_ASSET_LOADED + this.m_Material.diffuseTexName) {
            this.m_AssetLoaded = true;
            let asset = message.Context as ImageAsset;
            this.m_AssetWidth = asset.width;
            this.m_AssetHeight = asset.height;
            this.calculateUVs();
        }
    }

    public load(): void {
       super.load();
       if(!this.m_AssetLoaded) {
        this.setupFromMaterial();
       }
    
    }

    public update(dt: number): void {
        if(!this.m_AssetLoaded){
            this.setupFromMaterial();
            return;
        }

        if(!this.m_IsPlaying) {
            return
        }

        this.m_CurrentTime += dt;
        if(this.m_CurrentTime > this.m_FrameTime) {
            this.m_CurrentFrame++;
            this.m_CurrentTime = 0;

            if(this.m_CurrentFrame >= this.m_FrameSequance.length){
                this.m_CurrentFrame = 0;
            }


            let frameUVs = this.m_FrameSequance[this.m_CurrentFrame];
            vec2.copy(this.m_Vertices[0].TexCoords, this.m_FrameUVs[frameUVs].Min);
            vec2.set(this.m_Vertices[1].TexCoords, this.m_FrameUVs[frameUVs].Min[0], this.m_FrameUVs[frameUVs].Max[1]);
            vec2.copy(this.m_Vertices[2].TexCoords, this.m_FrameUVs[frameUVs].Max);
            vec2.copy(this.m_Vertices[3].TexCoords, this.m_FrameUVs[frameUVs].Max);
            vec2.set(this.m_Vertices[4].TexCoords, this.m_FrameUVs[frameUVs].Max[0], this.m_FrameUVs[frameUVs].Min[1]);
            vec2.copy(this.m_Vertices[5].TexCoords, this.m_FrameUVs[frameUVs].Min);

            this.m_Buffer.clearData();
            for(let v of this.m_Vertices) {
                this.m_Buffer.pushBackData(v.toArray());
            }

            this.m_Buffer.upload(); 
            this.m_Buffer.unbind();
        }


        super.update(dt);
    }

    private calculateUVs(): void {
       
       let totalWidth: number = 0;
       let yvalue: number = 0;
       for (let i = 0; i < this.m_FrameCount; ++i) {
            totalWidth += i * this.m_FrameWidth;

            if(totalWidth > this.m_AssetWidth) {
                yvalue++;
                totalWidth = 0;
            }


            let texWidth: number = this.m_AssetWidth;
            let texHeihgt: number = this.m_AssetHeight;

            let u = (i * this.m_FrameWidth) / texWidth;         // pixel x value (0,1)
            let v = (yvalue * this.m_FrameHeight) / texHeihgt;  // pixel y value (0,1)
            let min= vec2.create();
            vec2.set(min, u, v);

            let uMax = ((i * this.m_FrameWidth) + this.m_FrameWidth) / texWidth;         // pixel x value (0,1)
            let vMax = ((yvalue * this.m_FrameHeight) + this.m_FrameHeight) / texHeihgt;  // pixel y value (0,1)
            let max= vec2.create()
            vec2.set(max, uMax, vMax);


            this.m_FrameUVs.push(new UVInfo(min, max));



       }
    
    }

    private setupFromMaterial(): void {
        if(!this.m_AssetLoaded) {
            let material = MaterialManager.getMaterial(this.m_MaterialName);
            if(material.diffuseTexture.isLoaded) {
                if(AssetManager.isAssetLoaded(material.diffuseTexName)) {
                    this.m_AssetHeight = material.diffuseTexture.height;
                    this.m_AssetWidth = material.diffuseTexture.width;
                    this.m_AssetLoaded = true;
                    this.calculateUVs();
                }
            }
        }
    }
}
