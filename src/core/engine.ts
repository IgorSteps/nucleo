import {gl, GLUtilities} from "./gl/gl";
import Sprite from "./graphics/sprite";
import Shader from "./gl/shader";
import { mat4, vec2 } from "gl-matrix";
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
import FontManager from "./graphics/fontManager";
import Level from "./world/level";

export default class Engine implements IMessageHadnler{

    private m_Canvas: HTMLCanvasElement;
    private m_BasicShader: Shader;
    private m_Projection: mat4;
    private m_PreviousTime: number = 0;
    private m_GameWidth: number;
    private m_GameHeight: number;

    private m_IsFirstUpdate: boolean = true;
    private m_Aspect: number;


    constructor(w?: number, h?: number) {
        this.m_GameWidth = w;
        this.m_GameHeight = h;
    }

    public start(elementName?: string): void {
        // Init canvas
        this.m_Canvas = GLUtilities.init(elementName);

        if(this.m_GameWidth !== undefined && this.m_GameHeight !== undefined) {
            this.m_Aspect = this.m_GameWidth/ this.m_GameHeight;
        }

        // Init Managers
        AssetManager.init();
        InputManager.init(this.m_Canvas);
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
        
        // Load fonts
        FontManager.addFont("default", "../assets/fonts/text.txt");
        FontManager.load();

        // Load Materials
        MaterialManager.registerMaterial(new Material("bg", "../assets/textures/bg.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("end", "../assets/textures/end.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("middle", "../assets/textures/middle.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("grass", "../assets/textures/grass.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("duck", "../assets/textures/duck.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("playbtn", "../assets/textures/playbtn.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("restartbtn", "../assets/textures/restartbtn.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("score", "../assets/textures/score.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("title", "../assets/textures/title.png", new Colour(255, 255, 255, 255)));
        MaterialManager.registerMaterial(new Material("tutorial", "../assets/textures/tutorial.png", new Colour(255, 255, 255, 255)));

        // Load sound files
        AudioManager.loadSoundFile("flap", "../assets/audio/flap.mp3", false);
        AudioManager.loadSoundFile("ting", "../assets/audio/ting.mp3", false);
        AudioManager.loadSoundFile("dead", "../assets/audio/dead.mp3", false);

        
        this.resize()
        
        // Begin preloading phase
        this.preload()
    }


    public resize(): void {
        if(this.m_Canvas !== undefined) {
            if(this.m_GameWidth === undefined || this.m_GameHeight === undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;
                gl.viewport(0, 0, window.innerWidth, window.innerHeight);
                    this.m_Projection = mat4.ortho(this.m_Projection, 0, window.innerWidth, window.innerHeight, 0, -100.0, 100.0);
                } else {
                    let newWidth = window.innerWidth;
                    let newHeight = window.innerHeight;
                    let newWidthToHeight = newWidth / newHeight;
                    let gameArea = document.getElementById("gameArea");

                    if (newWidthToHeight > this.m_Aspect) {
                        newWidth = newHeight * this.m_Aspect;
                        gameArea.style.height = newHeight + 'px';
                        gameArea.style.width = newWidth + 'px';
                    } else {
                        newHeight = newWidth / this.m_Aspect;
                        gameArea.style.width = newWidth + 'px';
                        gameArea.style.height = newHeight + 'px';
                    }

                    gameArea.style.marginTop = (-newHeight / 2) + 'px';
                    gameArea.style.marginLeft = (-newWidth / 2) + 'px';

                    this.m_Canvas.width = newWidth;
                    this.m_Canvas.height = newHeight;

                    gl.viewport(0, 0, newWidth, newHeight);
                    this.m_Projection = mat4.ortho(this.m_Projection, 0, this.m_GameWidth, this.m_GameHeight, 0, -100.0, 100.0);

                    let resolutionScale = vec2.fromValues(newWidth / this.m_GameWidth, newHeight / this.m_GameHeight);
                    InputManager.setResolutionScale(resolutionScale);
            }
        }
    }


    private loop(): void {
        if(this.m_IsFirstUpdate) {
            // TODO
        }
        this.update()
        this.render()
        requestAnimationFrame( this.loop.bind( this ) );
    }

    private update(): void {
        let dt = performance.now() - this.m_PreviousTime;
        MessageBus.update(dt);
        LevelManager.update(dt);
        CollisionManager.update(dt);
        this.m_PreviousTime = performance.now();
    }

    private preload(): void {
        // Make sure to always update the message bus
        MessageBus.update(0);

        if(!FontManager.updateReady()) {
            requestAnimationFrame(this.preload.bind(this));
            return
        }

        // Load level
        LevelManager.changeLevel(0);

        // Start game loop
        this.loop();
    }

    private render(): void {
        gl.clear(gl.COLOR_BUFFER_BIT);
        let projPos = this.m_BasicShader.getUniformLocation("u_projection");
        gl.uniformMatrix4fv(projPos, false, new Float32Array(this.m_Projection))
        LevelManager.render(this.m_BasicShader);

    }

    public onMessage(msg: Message): void {
        if(msg.Code === "MOUSE_UP") {
            let ctx = msg.Context as MouseContext;
            document.title = `Pos: ${ctx.position[0]}, ${ctx.position[1]}`;

        }
    }

}
