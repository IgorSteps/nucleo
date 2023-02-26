import {gl, GLUtilities} from "./gl/gl";
import Sprite from "./graphics/sprite";
import Shader from "./gl/shader";
import { mat4 } from "gl-matrix";
import AssetManager from "./assets/assetManager";
import MessageBus from "./message/messageBus";
import BasicShader from "./gl/shaders/basicShader";
import MaterialManager from "./graphics/materialManager";
import Material from "./graphics/material";
import Colour from "./graphics/colour";
import LevelManager from "./world/levelManager";
import { ComponentManager } from "./components/componentManager";

export default class Engine {

    private m_Canvas: HTMLCanvasElement;
    private m_BasicShader: Shader;
    private m_Projection: mat4;

    public constructor() {}

    public start(): void {
        // Init canvas
        this.m_Canvas = GLUtilities.init();

        // Init Asset manager
        AssetManager.init();
        LevelManager.init();
        ComponentManager.init();


        gl.clearColor(0,0,0,1);

        // Load Shader
        this.m_BasicShader = new BasicShader();
        this.m_BasicShader.use();

        // Set up projection matrix
        this.m_Projection = mat4.create();
        this.m_Projection = mat4.ortho(this.m_Projection, 0.0, this.m_Canvas.width, this.m_Canvas.height, 0.0, -100.0, 100.0);
        
        // Load Materials
        MaterialManager.registerMaterial(new Material("crate", "../assets/textures/crate.jpg", new Colour(255, 128, 0, 255)));

        // Load test level
        LevelManager.changeLevel(0);


        this.resize()
        this.loop();
    }


    public resize(): void {
        if(this.m_Canvas !== undefined) {
            this.m_Canvas.width = window.innerWidth;
            this.m_Canvas.height = window.innerHeight;
        }

        gl.viewport(0, 0, this.m_Canvas.width, this.m_Canvas.height);
        this.m_Projection = mat4.ortho(this.m_Projection, 0.0, this.m_Canvas.width, this.m_Canvas.height, 0.0, -100.0, 100.0);

    }


    private loop(): void {
        MessageBus.update(0);
        LevelManager.update(0);

        gl.clear(gl.COLOR_BUFFER_BIT);

        
        // set uniforms
        let projPos = this.m_BasicShader.getUniformLocation("u_projection");
        gl.uniformMatrix4fv(projPos, false, new Float32Array(this.m_Projection))
        LevelManager.render(this.m_BasicShader);

        requestAnimationFrame( this.loop.bind( this ) );
    }

}
