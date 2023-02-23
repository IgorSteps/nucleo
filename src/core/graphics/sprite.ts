import { vec3 } from 'gl-matrix';
import { gl } from '../gl/gl';
import {GLBuffer, AttributeInfo} from '../gl/glBuffer'
import Shader from '../gl/shader';
import Texture from './texture';
import TextureManager from './textureManager';
export default class Sprite {

    private m_Name: string;
    private m_Width: number;
    private m_Height: number;

    private m_Buffer: GLBuffer;
    private m_Texture: Texture;
    private m_TextureName: string;

    public m_Position: vec3 = vec3.create();

    constructor(name: string, textureName: string, width: number = 100, height: number = 100) {
        this.m_Name = name;
        this.m_Height = height;
        this.m_Width = width;
        this.m_TextureName = textureName;
        this.m_Texture = TextureManager.getTexture(textureName);
    }

    public destroy(): void {
        this.m_Buffer.destroy();
        TextureManager.releaseTexture(this.m_TextureName);
    }

    public get name(): string {
        return this.m_Name;
    }



    public load(): void {
        this.m_Buffer = new GLBuffer(5);
        
        let positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.size = 3;
        positionAttribute.offset = 0;
        this.m_Buffer.addAttributeLocation(positionAttribute);
        

        let texCoordAttribute = new AttributeInfo();
        texCoordAttribute.location = 1;
        texCoordAttribute.size = 2;
        texCoordAttribute.offset = 3;
        this.m_Buffer.addAttributeLocation(texCoordAttribute);
        
        this.m_Buffer.bind();
        
        let coords = [
            // x,y,z                                // u, v
            0,              0,              0,      0, 0,
            0,              this.m_Height,  0,      0, 1.0,
            this.m_Width,   this.m_Height,  0,      1.0, 1.0,

            this.m_Width,   this.m_Height,  0,      1.0, 1.0,
            this.m_Width,   0,              0,      1.0, 0,
            0,              0,              0,      0, 0,
        ];
        this.m_Buffer.pushBackData(coords)
        this.m_Buffer.upload(); 

        this.m_Buffer.unbind();
    }

    public update(dt: number): void {

    }

    public draw(shader: Shader): void {

        this.m_Texture.activateAndBind(0);
        let diffuseLocation = shader.getUniformLocation("u_diffuse");
        gl.uniform1i(diffuseLocation, 0);


        this.m_Buffer.bindVAO();
        this.m_Buffer.draw(); 
    }
}