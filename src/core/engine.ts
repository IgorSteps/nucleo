import {gl, GLUtilities} from "./gl/gl";
import Sprite from "./graphics/sprite";
import Shader from "./gl/shader";
import { mat4 } from "gl-matrix";
import AssetManager from "./assets/assetManager";
import MessageBus from "./message/messageBus";

export default class Engine {

    private m_Canvas: HTMLCanvasElement;
    private m_Shader: Shader;
    private m_Sprite: Sprite;
    private m_Projection: mat4
    private m_Model: mat4

    public constructor() {}

    public start(): void {
        this.m_Canvas = GLUtilities.init();

        AssetManager.init();
        gl.clearColor(0,0,0,1);

        this.loadShaders();
        this.m_Shader.use();

        this.m_Model = mat4.create();
        this.m_Projection = mat4.create();
        // 0,0 is top left
        this.m_Projection = mat4.ortho(this.m_Projection, 0.0, this.m_Canvas.width, this.m_Canvas.height, 0.0, -100.0, 100.0);
        
        
        this.m_Sprite = new Sprite("test", "../assets/textures/crate.jpg");
        this.m_Sprite.load();
        this.m_Sprite.m_Position[0] = 20;

        this.resize()
        this.loop();
    }


    public resize(): void {
        if(this.m_Canvas !== undefined) {
            this.m_Canvas.width = window.innerWidth;
            this.m_Canvas.height = window.innerHeight;
        }

        gl.viewport(0, 0, this.m_Canvas.width, this.m_Canvas.height);
    }


    private loop(): void {
        MessageBus.update(0);

        gl.clear(gl.COLOR_BUFFER_BIT);

        // set uniforms
        let colorPos = this.m_Shader.getUniformLocation("u_tint");
        gl.uniform4f(colorPos, 1, 1, 1, 1);

        let projPos = this.m_Shader.getUniformLocation("u_projection");
        gl.uniformMatrix4fv(projPos, false, new Float32Array(this.m_Projection))

        let modelPos = this.m_Shader.getUniformLocation("u_model");
        gl.uniformMatrix4fv(modelPos, false, new Float32Array(mat4.translate(mat4.create(), this.m_Model, this.m_Sprite.m_Position)))


        this.m_Sprite.draw(this.m_Shader);

        requestAnimationFrame( this.loop.bind( this ) );
    }


    private loadShaders(): void {
        let vertShader = `#version 300 es

            in vec4 a_position;
            in vec2 a_texCoord;

            uniform mat4 u_projection;
            uniform mat4 u_model;

            out vec2 v_texCoord;
            
            void main() {
                gl_Position =  u_projection * u_model * a_position;
                v_texCoord = a_texCoord;
            }`;

        let fragShader = `#version 300 es

            precision highp float;

            uniform vec4 u_tint;
            uniform sampler2D u_diffuse;

            out vec4 outColor;
            in vec2 v_texCoord;
            
            
            void main() {
                outColor = u_tint * texture(u_diffuse, v_texCoord);
            }`;

        this.m_Shader = new Shader("basic", vertShader, fragShader);
    }
}
