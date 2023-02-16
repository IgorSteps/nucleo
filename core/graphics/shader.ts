namespace Nucleo {

    export class Shader {

        private m_Name: string;
        public m_Program: WebGLProgram

        /**
         * 
         * @param name Name of the shader
         * @param vertSource Vertex shader
         * @param fragSource Fragment shader
         */
        constructor(name:string, vertSource: string, fragSource: string) {
            this.m_Name = name;
            let vertexShader = this.loadShader(vertSource, gl.VERTEX_SHADER);
            let fragShader = this.loadShader(fragSource, gl.FRAGMENT_SHADER);

            this.createShaderProgram(vertexShader, fragShader);
        }

        public get name():string { 
            return this.m_Name;
        }


        public use():void {
            gl.useProgram(this.m_Program);
        }


        private loadShader(source: string, shaderType: number): WebGLShader {
            let shader: WebGLShader = gl.createShader(shaderType);

            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                var info = gl.getShaderInfoLog(shader);
                throw new Error(`error compiling shader '${this.m_Name}' : ${info}`);
            }

            return shader;
        }

        private createShaderProgram(vertShader: WebGLShader, fragShader: WebGLShader): void {
            this.m_Program = gl.createProgram();

            gl.attachShader(this.m_Program, vertShader)
            gl.attachShader(this.m_Program, fragShader)

            gl.linkProgram(this.m_Program);

            if ( !gl.getProgramParameter( this.m_Program, gl.LINK_STATUS) ) {
                var info = gl.getProgramInfoLog(this.m_Program);
                throw new Error(`error linking shader ${this.m_Name} : ${info}`);
            }
        }
    }
}