namespace Nucleo {


    export class Engine {

        private m_Canvas: HTMLCanvasElement;
        private m_Shader: Shader;
        private m_Buffer: WebGLBuffer;
        private m_Vao : WebGLVertexArrayObject;

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

            // Bind the attribute/buffer set we want.
            gl.bindVertexArray(this.m_Vao);
            gl.drawArrays(gl.TRIANGLES, 0, 3);

            requestAnimationFrame( this.loop.bind( this ) );
        }

        private createBuffer():void {
            // look up where the vertex data needs to go.
            let positionAttributeLocation = gl.getAttribLocation(this.m_Shader.m_Program, "a_position");
            this.m_Buffer = gl.createBuffer();
            // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.m_Buffer);

            let vertices = [
                0, 0, 0,
                0, .5, 0,
                .5, .5, 0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            // create m_Vao
            this.m_Vao = gl.createVertexArray();
            gl.bindVertexArray(this.m_Vao); // bind to it

            // turn on
            gl.enableVertexAttribArray(positionAttributeLocation);
            // how to get data out of position buffer
            gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);



            //gl.bindBuffer(gl.ARRAY_BUFFER, undefined);
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
                    outColor = vec4(1, 1, 1, 1);
                }`;

            this.m_Shader = new Shader("basic", vertShader, fragShader);
        }
    }
}