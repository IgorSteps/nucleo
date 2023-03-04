import { mat4, vec3 } from 'gl-matrix';

import { gl } from '../gl/gl';
import {GLBuffer, AttributeInfo} from '../gl/glBuffer'

import Shader from '../gl/shader';
import IMessageHadnler from '../message/IMessageHandler';
import Material from './material';
import MaterialManager from './materialManager';
import Vertex from './vertex';




export default class Sprite{

    protected m_Name: string;
    protected m_Width: number;
    protected m_Height: number;
    protected m_Origin: vec3 = vec3.create();

    private m_Model: mat4 = mat4.create();
    protected m_Vertices: Vertex[] = [];

    protected m_Buffer: GLBuffer;
    protected m_Material: Material;
    protected m_MaterialName: string;

    protected m_Position: vec3 = vec3.create();

    constructor(name: string, materialName: string, width: number = 100, height: number = 100) {
        this.m_Name = name;
        this.m_Height = height;
        this.m_Width = width;
        this.m_MaterialName = materialName;
        this.m_Material = MaterialManager.getMaterial(this.m_MaterialName);
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

    public get origin(): vec3 {
        return this.m_Origin;
    }

    public set origin(v: vec3) {
        vec3.set(this.m_Origin, v[0], v[1], v[2]);
        this.recalculateVertices();
    }

    public load(): void {
        this.m_Buffer = new GLBuffer();
        
        let positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.size = 3;
        this.m_Buffer.addAttributeLocation(positionAttribute);
        

        let texCoordAttribute = new AttributeInfo();
        texCoordAttribute.location = 1;
        texCoordAttribute.size = 2;
        this.m_Buffer.addAttributeLocation(texCoordAttribute);
        
        this.m_Buffer.bind();
        this.calcalateVertices()
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

    protected calcalateVertices():void {
        let minX = -(this.m_Width * this.m_Origin[0]);
        let maxX = this.m_Width * (1.0 - this.m_Origin[0]);

        let minY = -(this.m_Height * this.m_Origin[1]);
        let maxY = this.m_Height * (1.0 - this.m_Origin[1]);
        
        this.m_Vertices = [
                        // x,y,z            // u, v
            new Vertex(minX,   minY,  0,      0,   0),
            new Vertex(minX,   maxY,  0,      0,   1.0),
            new Vertex(maxX,   maxY,  0,      1.0, 1.0),

            new Vertex(maxX,   maxY,  0,      1.0, 1.0),
            new Vertex(maxX,   minY,  0,      1.0, 0),
            new Vertex(minX,   minY,  0,      0,   0),
        ];
        for(let v of this.m_Vertices) {
            this.m_Buffer.pushBackData(v.toArray());
        }

        this.m_Buffer.upload(); 
        this.m_Buffer.unbind();
    }

    protected recalculateVertices(): void {
        let minX = -(this.m_Width * this.m_Origin[0]);
        let maxX = this.m_Width * (1.0 - this.m_Origin[0]);

        let minY = -(this.m_Height * this.m_Origin[1]);
        let maxY = this.m_Height * (1.0 - this.m_Origin[1]);

        vec3.set( this.m_Vertices[0].Position, minX, minY, 0);
        vec3.set( this.m_Vertices[1].Position, minX, maxY, 0);
        vec3.set( this.m_Vertices[2].Position, maxX, maxY, 0);
        vec3.set( this.m_Vertices[3].Position, maxX, maxY, 0);
        vec3.set( this.m_Vertices[4].Position, maxX, minY, 0);
        vec3.set( this.m_Vertices[5].Position, minX, minY, 0);

        this.m_Buffer.clearData();
        for(let v of this.m_Vertices) {
            this.m_Buffer.pushBackData(v.toArray());
        }

        this.m_Buffer.upload(); 
        this.m_Buffer.unbind();
    }
    
}