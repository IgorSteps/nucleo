
import {gl} from '../gl/gl'

export default class Shader {

        private m_Name: string;
        private m_Program: WebGLProgram
        private m_Attributes: {[name: string]: number} = {};
        private m_Uniforms: {[name:string]: WebGLUniformLocation} = {};

        /**
         * Creates shader
         * @param name Name of the shader
         * @param vertSource Vertex shader
         * @param fragSource Fragment shader
         */
        constructor(name:string, vertSource: string, fragSource: string) {
            this.m_Name = name;
            let vertexShader = this.loadShader(vertSource, gl.VERTEX_SHADER);
            let fragShader = this.loadShader(fragSource, gl.FRAGMENT_SHADER);

            this.createShaderProgram(vertexShader, fragShader);
            this.detectAttributes();
            this.detectUniforms();
        }

        public get name():string { 
            return this.m_Name;
        }

        public use():void {
            gl.useProgram(this.m_Program);
        }

        /**
         * Gets location of an attribute with the given name
         * @param name Name of the attribute
         * @returns Location of the attribute with the given name
         */
        public getAttributeLocation(name:string): number {
           if(this.m_Attributes[name] === undefined ) {
            throw new Error(`error getting attribute '${name}' :for ${this.name}`)
           }
           return this.m_Attributes[name];
        }

        public getUniformLocation(name:string): WebGLUniformLocation {
            if(this.m_Uniforms[name] === undefined ) {
             throw new Error(`error getting uniform '${name}' :for ${this.name}`)
            }
            return this.m_Uniforms[name];
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

        private detectAttributes(): void {
            let attributeCount = gl.getProgramParameter(this.m_Program, gl.ACTIVE_ATTRIBUTES);
            for(let i=0; i<attributeCount; ++i) {
                let attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this.m_Program, i);
                if(!attributeInfo) {
                    break;
                }

                this.m_Attributes[attributeInfo.name] = gl.getAttribLocation(this.m_Program, attributeInfo.name);
            }
        }

        private detectUniforms(): void {
            let uniformCount = gl.getProgramParameter(this.m_Program, gl.ACTIVE_UNIFORMS);
            for(let i=0; i < uniformCount; ++i) {
                let unformInfo: WebGLActiveInfo = gl.getActiveUniform(this.m_Program, i);
                if(!unformInfo) {
                    break;
                }

                this.m_Uniforms[unformInfo.name] = gl.getUniformLocation(this.m_Program, unformInfo.name);
            }
        }



        
    }
