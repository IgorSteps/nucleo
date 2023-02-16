namespace Nucleo {

    export class Shader {

        private _name: string;
        private _program: WebGLProgram

        /**
         * 
         * @param name Name of the shader
         * @param vertSource Vertex shader
         * @param fragSource Fragment shader
         */
        constructor(name:string, vertSource: string, fragSource: string) {
            this._name = name;
            let vertexShader = this.loadShader(vertSource, gl.VERTEX_SHADER);
            let fragShader = this.loadShader(fragSource, gl.FRAGMENT_SHADER);

            this.createShaderProgram(vertexShader, fragShader);
        }

        public get name():string {
            return this._name;
        }

        public use():void {
            gl.useProgram(this._program);
        }


        private loadShader(source: string, shaderType: number): WebGLShader {
            let shader: WebGLShader = gl.createShader(shaderType);

            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                var info = gl.getShaderInfoLog(shader);
                throw new Error(`error compiling shader '${this._name}' : ${info}`);
            }

            return shader;
        }

        private createShaderProgram(vertShader: WebGLShader, fragShader: WebGLShader): void {
            this._program = gl.createProgram();

            gl.attachShader(this._program, vertShader)
            gl.attachShader(this._program, fragShader)

            gl.linkProgram(this._program);

            if ( !gl.getProgramParameter( this._program, gl.LINK_STATUS) ) {
                var info = gl.getProgramInfoLog(this._program);
                throw new Error(`error linking shader ${this._name} : ${info}`);
            }
        }
    }
}