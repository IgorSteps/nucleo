import { mat4, vec3 } from "gl-matrix";
import { gl } from "../gl/gl";
import { AttributeInfo, GLBuffer } from "../gl/glBuffer";
import Shader from "../gl/shader";
import { BitmapFont } from "./bitmapFont";
import Colour from "./colour";
import FontManager from "./fontManager";
import Material from "./material";
import Vertex from "./vertex";

export class BitmapText {
    private m_FontName: string;
    private m_IsDirty: boolean = false;

    protected m_Name: string;
    protected m_Origin: vec3 = vec3.create();
    protected m_Buffer: GLBuffer;
    protected m_Material: Material;
    protected m_BitMapFont: BitmapFont;
    protected m_Vertices: Vertex[] = [];
    protected m_Text: string;

    constructor(name: string, fontName: string) {
        this.m_Name = name;
        this.m_FontName = fontName;

    }

    public destroy() {
        this.m_Buffer.destroy();
        this.m_Material.destroy();
        this.m_Material = undefined;
    }

    public get name(): string {
        return this.m_Name;
    }

    public get text(): string {
        return this.m_Text;
    }
    public set text(v: string) {
       if(this.m_Text !== v) {
        this.m_Text = v;
        this.m_IsDirty = true;
       }
    }

    public get origin(): vec3 {
        return this.m_Origin
    }
    public set origin(v: vec3) {
        vec3.set(this.m_Origin, v[0], v[1], v[2]);
        this.calculateVertices();
    }

    public load(): void {
        this.m_BitMapFont = FontManager.getFont(this.m_FontName);
        this.m_Material = new Material(`BITMAP_FONT_${this.name}_${this.m_BitMapFont.size}`, this.m_BitMapFont.textureName, new Colour(255, 255, 255, 255));
        this.m_Buffer = new GLBuffer();

        let positionAtttribute = new AttributeInfo();
        positionAtttribute.location = 0;
        positionAtttribute.size = 3;
        this.m_Buffer.addAttributeLocation(positionAtttribute);

        let texCoordAttribute = new AttributeInfo();
        texCoordAttribute.location = 1;
        texCoordAttribute.size = 2;
        this.m_Buffer.addAttributeLocation(texCoordAttribute);
    }
    
    public update(dt: number): void {
        if(this.m_IsDirty && this.m_BitMapFont.isLoaded) {
            this.m_Buffer.bind();
            this.calculateVertices();
            this.m_IsDirty = false;
        }
    }

    public draw(shader: Shader, model: mat4): void {
        let modelLocation = shader.getUniformLocation("u_model");
        gl.uniformMatrix4fv(modelLocation, false, model)

        let colorLocation = shader.getUniformLocation("u_tint");
        gl.uniform4fv(colorLocation, this.m_Material.tint.toFloat32Array());

        if(this.m_Material.diffuseTexture !== undefined) {
            this.m_Material.diffuseTexture.activateAndBind(0);
            let diffuseLocation = shader.getUniformLocation("u_diffuse");
            gl.uniform1i(diffuseLocation, 0);

        }

        this.m_Buffer.bindVAO();
        this.m_Buffer.draw()
    }


    private calculateVertices() {
        this.m_Vertices.length = 0;
        this.m_Buffer.clearData();

        let x = 0;
        let y = 0;
        for(let c of this.m_Text) {
            if (c === '\n') {
                x = 0;
                y += this.m_BitMapFont.size;
                continue;
            }

            let g = this.m_BitMapFont.getGlyph(c);

            let minX = x + g.xOffset;
            let minY = y + g.yOffset;
            let maxX = minX + g.width;
            let maxY = minY + g.height;

            let minU = g.x / this.m_BitMapFont.width;
            let minV = g.y / this.m_BitMapFont.height;
            let maxU = (g.x + g.width)/ this.m_BitMapFont.width;
            let maxV = (g.y + g.height)/ this.m_BitMapFont.height;

            this.m_Vertices.push(new Vertex(minX, minY, 0, minU, minV));
            this.m_Vertices.push(new Vertex(minX, maxY, 0, minU, maxV));
            this.m_Vertices.push(new Vertex(maxX, maxY, 0, maxU, maxV));
            this.m_Vertices.push(new Vertex(maxX, maxY, 0, maxU, maxV));
            this.m_Vertices.push(new Vertex(maxX, minY, 0, maxU, minV));
            this.m_Vertices.push(new Vertex(minX, minY, 0, minU, minV));

            x += g.xAdvance;
        }

        for(let v of this.m_Vertices) {
            this.m_Buffer.pushBackData(v.toArray());
        }

        this.m_Buffer.upload();
        this.m_Buffer.unbind();
    }

}