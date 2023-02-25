import { mat4, vec3 } from 'gl-matrix';
import { gl } from '../gl/gl';
import {GLBuffer, AttributeInfo} from '../gl/glBuffer'
import Shader from '../gl/shader';
import Material from './material';
import MaterialManager from './materialManager';
import Texture from './texture';
import TextureManager from './textureManager';
export default class Sprite {

    private m_Name: string;
    private m_Width: number;
    private m_Height: number;

    private m_Model: mat4

    private m_Buffer: GLBuffer;
    private m_Material: Material;
    private m_MaterialName: string;

    public m_Position: vec3 = vec3.create();

    constructor(name: string, materialName: string, width: number = 100, height: number = 100) {
        this.m_Name = name;
        this.m_Height = height;
        this.m_Width = width;
        this.m_MaterialName = materialName;
        this.m_Material = MaterialManager.getMaterial(this.m_MaterialName);
        this.m_Model = mat4.create()
    }

    public destroy(): void {
        this.m_Buffer.destroy();
        MaterialManager.releaseMaterial(this.m_MaterialName);
        this.m_Material = undefined;
        this.m_MaterialName = undefined;
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

    public draw(shader: Shader, model: mat4): void {

        let modelLocation = shader.getUniformLocation("u_model");
        gl.uniformMatrix4fv(modelLocation, false, model)

        let colorPos = shader.getUniformLocation("u_tint");
        gl.uniform4fv(colorPos, this.m_Material.tint.toFloat32Array());

        if(this.m_Material.diffuseTexture !== undefined)
        {
            this.m_Material.diffuseTexture.activateAndBind(0);
            let diffuseLocation = shader.getUniformLocation("u_diffuse");
            gl.uniform1i(diffuseLocation, 0);
        }


        this.m_Buffer.bindVAO();
        this.m_Buffer.draw(); 
    }
}