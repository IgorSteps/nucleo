import {gl, GLUtilities} from "./gl/gl";
import Sprite from "./graphics/sprite";
import Shader from "./gl/shader";
import { mat4 } from "gl-matrix";
import AssetManager from "./assets/assetManager";
import MessageBus from "./message/messageBus";
import BasicShader from "./gl/shaders/basicShader";

export default class Engine {

    private m_Canvas: HTMLCanvasElement;
    private m_BasicShader: Shader;
    private m_Sprite: Sprite;
    private m_Projection: mat4
    private m_Model: mat4

    public constructor() {}

    public start(): void {
        this.m_Canvas = GLUtilities.init();

        AssetManager.init();
        gl.clearColor(0,0,0,1);

        this.m_BasicShader = new BasicShader();
        this.m_BasicShader.use();

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
        let colorPos = this.m_BasicShader.getUniformLocation("u_tint");
        gl.uniform4f(colorPos, 1, 1, 1, 1);

        let projPos = this.m_BasicShader.getUniformLocation("u_projection");
        gl.uniformMatrix4fv(projPos, false, new Float32Array(this.m_Projection))

        let modelPos = this.m_BasicShader.getUniformLocation("u_model");
        gl.uniformMatrix4fv(modelPos, false, new Float32Array(mat4.translate(mat4.create(), this.m_Model, this.m_Sprite.m_Position)))


        this.m_Sprite.draw(this.m_BasicShader);

        requestAnimationFrame( this.loop.bind( this ) );
    }

}
