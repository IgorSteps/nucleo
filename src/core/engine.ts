import {gl, GLUtilities} from "./gl/gl";
import Sprite from "./graphics/sprite";
import Shader from "./gl/shader";



    export default class Engine {

        private m_Canvas: HTMLCanvasElement;
        private m_Shader: Shader;
        private m_Sprite: Sprite;

        public constructor() {
        }

        public start(): void {
            this.m_Canvas = GLUtilities.init();


            gl.clearColor(0,0,0,1);

            this.loadShaders();
            this.m_Shader.use();

            this.m_Sprite = new Sprite("test");
            this.m_Sprite.load();

            this.resize()
            this.loop();
        }


        public resize(): void {
            if(this.m_Canvas !== undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;
            }

            gl.viewport(0,0,this.m_Canvas.width, this.m_Canvas.height);
        }


        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            let colorPos = this.m_Shader.getUniformLocation("u_color");
            gl.uniform4f(colorPos, 1, 0.5, 0, 1);
            this.m_Sprite.draw();

            requestAnimationFrame( this.loop.bind( this ) );
        }


        private loadShaders(): void {
            let vertShader = `#version 300 es

                in vec4 a_position;
                
                void main() {
                    gl_Position = a_position;
                }`;

            let fragShader = `#version 300 es

                precision highp float;
                uniform vec4 u_color;
                out vec4 outColor;
                
                
                void main() {
                    outColor = u_color;
                }`;

            this.m_Shader = new Shader("basic", vertShader, fragShader);
        }
    }
