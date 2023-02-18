namespace Nucleo {


    export class Engine {

        private m_Canvas: HTMLCanvasElement;
        private m_Shader: Shader;
        private m_Buffer: GLBuffer;

        public constructor() {
        }

        public start(): void {
            this.m_Canvas = GLUtilities.init();


            gl.clearColor(0,0,0,1);

            this.loadShaders();
            this.m_Shader.use();

            this.createBuffer();

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
            this.m_Buffer.bindVAO();
            this.m_Buffer.draw();

            requestAnimationFrame( this.loop.bind( this ) );
        }

        private createBuffer():void {
            this.m_Buffer = new GLBuffer(3);
            
            let positionAttribute = new AttributeInfo();
            positionAttribute.location = this.m_Shader.getAttributeLocation("a_position");
            positionAttribute.size = 3;
            positionAttribute.offset = 0;
            this.m_Buffer.addAttributeLocation(positionAttribute);
            
            this.m_Buffer.bind();
            
            let vertices = [
                0, 0, 0,
                0, .5, 0,
                .5, .5, 0,
            ];
            this.m_Buffer.pushBackData(vertices)
            this.m_Buffer.upload(); 

            this.m_Buffer.unbind();
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
}