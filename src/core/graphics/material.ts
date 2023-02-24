import Colour from "./colour";
import Texture from "./texture";
import TextureManager from "./textureManager";

export default class Material {

    private m_Name: string;
    private m_DiffuseTextureName: string;
    private m_DiffuseTexture: Texture
    private m_Tint: Colour;

    constructor(name: string, diffuseTexName: string, tint: Colour) {
        this.m_Name = name;
        this.m_DiffuseTextureName = diffuseTexName;
        this.m_Tint = tint;

        if(this.m_DiffuseTextureName !== undefined){
            this.m_DiffuseTexture = TextureManager.getTexture(this.m_DiffuseTextureName);
        }
    }

    public destroy():void {
        TextureManager.releaseTexture(this.m_DiffuseTextureName);
        this.m_DiffuseTexture = undefined;
    }

    public get name(): string {
        return this.m_Name;
    }

    public get diffuseTexture(): Texture {
        return this.m_DiffuseTexture;
    }

    public get tint(): Colour {
        return this.m_Tint;
    }

    public get diffuseTexName(): string {
        return this.m_DiffuseTextureName;
    }

    public set diffuseTexName(name: string) {
        if(this.m_DiffuseTexture !== undefined) {
            TextureManager.releaseTexture(this.m_DiffuseTextureName);
        }

        this.m_DiffuseTextureName = name;
        if(this.m_DiffuseTextureName !== undefined){
            TextureManager.getTexture(this.m_DiffuseTextureName);
        }
    }
}