import Texture from "./texture";

class textureReferenceNode{
    public Texture: Texture;
    public ReferenceNode: number = 1;

    constructor(texture: Texture) {
        this.Texture = texture;
    }
}

export default class TextureManager {

    private static m_Textures:{[name:string]: textureReferenceNode} = {};

    private constructor(){}

    public static getTexture(textureName: string): Texture {
        if(TextureManager.m_Textures[textureName] === undefined){
            let texture = new Texture(textureName);
            TextureManager.m_Textures[textureName] = new textureReferenceNode(texture);
        } else {
            TextureManager.m_Textures[textureName].ReferenceNode++;
        }

        return TextureManager.m_Textures[textureName].Texture;
    }


    public static releaseTexture(textureName: string): void {
        TextureManager.m_Textures[textureName];
        if(TextureManager.m_Textures[textureName] === undefined){
            console.warn(`A texture name ${textureName} doesn't exist, hence can't be released`);
        } else {
            TextureManager.m_Textures[textureName].ReferenceNode--;
            if(TextureManager.m_Textures[textureName].ReferenceNode < 1) {
                TextureManager.m_Textures[textureName].Texture.destroy();
                TextureManager.m_Textures[textureName] = undefined;
                delete TextureManager.m_Textures[textureName];
            }
        }
    }

}