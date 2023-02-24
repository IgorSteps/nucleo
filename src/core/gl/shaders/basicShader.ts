import Shader from "../shader";

export default class BasicShader extends Shader {

    constructor(){
        super("basic");

        this.load(this.getVertexSource(), this.getFragmentSource());
    }

    private getVertexSource(): string {
        return `#version 300 es

        in vec4 a_position;
        in vec2 a_texCoord;

        uniform mat4 u_projection;
        uniform mat4 u_model;

        out vec2 v_texCoord;
        
        void main() {
            gl_Position =  u_projection * u_model * a_position;
            v_texCoord = a_texCoord;
        }`;
    }

    private getFragmentSource(): string {
        return `#version 300 es

        precision highp float;

        uniform vec4 u_tint;
        uniform sampler2D u_diffuse;

        out vec4 outColor;
        in vec2 v_texCoord;
        
        
        void main() {
            outColor = u_tint * texture(u_diffuse, v_texCoord);
        }`;
    }
}
