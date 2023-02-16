namespace Nucleo {


    export class Engine {

        private _canvas: HTMLCanvasElement;
        private _shader: Shader;

        public constructor() {
        }

        public start(): void {
            this._canvas = GLUtilities.init()


            gl.clearColor(0,0,0,1)

            this.loadShaders();
            this._shader.use();
            this.loop();
        }


        public resize(): void {
            if(this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
        }


        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT)


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
                
                out vec4 outColor;
                
                void main() {
                    outColor = vec4(1, 0, 0.5, 1);
                }`;

            this._shader = new Shader("basic", vertShader, fragShader);
        }
    }
}