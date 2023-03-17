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
import { BehaviourManager } from "./behaviours/behaviourManager";
import InputManager, { MouseContext } from "./input/inputManager";
import IMessageHadnler from "./message/IMessageHandler";
import Message from "./message/message";
import AudioManager from "./audio/audioManager";
import { CollisionManager } from "./collision/collisionManager";

export default class Engine implements IMessageHadnler{

    private m_Canvas: HTMLCanvasElement;
    private m_BasicShader: Shader;
    private m_Projection: mat4;
    private m_PreviousTime: number = 0;
    private m_GameWidth: number;
    private m_GameHeight: number;


    constructor(w?: number, h?: number) {
        this.m_GameWidth = w;
        this.m_GameHeight = h;
    }

    public start(): void {
        // Init canvas
        this.m_Canvas = GLUtilities.init();

        if(this.m_GameWidth !== undefined && this.m_GameHeight !== undefined) {
            this.m_Canvas.style.width = this.m_GameWidth + "px";
            this.m_Canvas.style.height = this.m_GameHeight + "px";
            this.m_Canvas.width = this.m_GameWidth;
            this.m_Canvas.height = this.m_GameHeight;
        }

        // Init Managers
        AssetManager.init();
        InputManager.init();
        LevelManager.init();
        ComponentManager.init();
        BehaviourManager.init();

        gl.clearColor(146/255, 206/255, 247/255, 1);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Load Shader
        this.m_BasicShader = new BasicShader();
        this.m_BasicShader.use();

        // Set up projection matrix
        this.m_Projection = mat4.create();
        this.m_Projection = mat4.ortho(this.m_Projection, 0.0, this.m_Canvas.width, this.m_Canvas.height, 0.0, -100.0, 100.0);
        
        // Load Materials
        MaterialManager.registerMaterial(new Material("bg", "../assets/textures/bg.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("end", "../assets/textures/end.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("middle", "../assets/textures/middle.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("grass", "../assets/textures/grass.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("duck", "../assets/textures/duck.png", new Colour(255, 255, 255, 255)));

        // Load sound files
        AudioManager.loadSoundFile("flap", "../assets/audio/flap.mp3", false);
        AudioManager.loadSoundFile("ting", "../assets/audio/ting.mp3", false);
        AudioManager.loadSoundFile("dead", "../assets/audio/dead.mp3", false);

        // Load test level
        LevelManager.changeLevel(0);
        this.resize()
        this.loop();
    }


    public resize(): void {
        if(this.m_Canvas !== undefined) {
            if(this.m_GameWidth === undefined || this.m_GameHeight === undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;
            }
        }

        gl.viewport(0, 0, this.m_Canvas.width, this.m_Canvas.height);
        this.m_Projection = mat4.ortho(this.m_Projection, 0.0, this.m_Canvas.width, this.m_Canvas.height, 0.0, -100.0, 100.0);

    }


    private loop(): void {
        this.update()
        this.render()
    }

    private update(): void {
        let dt = performance.now() - this.m_PreviousTime;
        MessageBus.update(dt);
        LevelManager.update(dt);
        CollisionManager.update(dt);
        this.m_PreviousTime = performance.now();
    }

    private render(): void {
        gl.clear(gl.COLOR_BUFFER_BIT);
        let projPos = this.m_BasicShader.getUniformLocation("u_projection");
        gl.uniformMatrix4fv(projPos, false, new Float32Array(this.m_Projection))
        LevelManager.render(this.m_BasicShader);

        requestAnimationFrame( this.loop.bind( this ) );
    }

    public onMessage(msg: Message): void {
        if(msg.Code === "MOUSE_UP") {
            let ctx = msg.Context as MouseContext;
            document.title = `Pos: ${ctx.position[0]}, ${ctx.position[1]}`;

        }
    }

}
