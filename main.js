var engine;
window.onload = function () {
    engine = new TSE.Engine();
    engine.start();
};
window.onresize = () => {
    engine.resize();
};
var TSE;
(function (TSE) {
    class Engine {
        constructor() {
        }
        start() {
            this._canvas = TSE.GLUtilities.init();
            TSE.gl.clearColor(0, 0, 0, 1);
            this.loadShaders();
            this._shader.use();
            this.loop();
        }
        resize() {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
        }
        loop() {
            TSE.gl.clear(TSE.gl.COLOR_BUFFER_BIT);
            requestAnimationFrame(this.loop.bind(this));
        }
        loadShaders() {
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
            this._shader = new TSE.Shader("basic", vertShader, fragShader);
        }
    }
    TSE.Engine = Engine;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    class GLUtilities {
        static init(elementId) {
            let canvas;
            if (elementId !== undefined) {
                canvas = document.getElementById(elementId);
                if (canvas === undefined) {
                    throw new Error("Cannot find a canvas element of id: " + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            TSE.gl = canvas.getContext("webgl2");
            if (TSE.gl === undefined) {
                throw new Error("Unable to initilise WebGL2");
            }
            return canvas;
        }
    }
    TSE.GLUtilities = GLUtilities;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    class Shader {
        constructor(name, vertSource, fragSource) {
            this._name = name;
            let vertexShader = this.loadShader(vertSource, TSE.gl.VERTEX_SHADER);
            let fragShader = this.loadShader(fragSource, TSE.gl.FRAGMENT_SHADER);
            this.createShaderProgram(vertexShader, fragShader);
        }
        get name() {
            return this._name;
        }
        use() {
            TSE.gl.useProgram(this._program);
        }
        loadShader(source, shaderType) {
            let shader = TSE.gl.createShader(shaderType);
            TSE.gl.shaderSource(shader, source);
            TSE.gl.compileShader(shader);
            if (!TSE.gl.getShaderParameter(shader, TSE.gl.COMPILE_STATUS)) {
                var info = TSE.gl.getShaderInfoLog(shader);
                throw new Error(`error compiling shader '${this._name}' : ${info}`);
            }
            return shader;
        }
        createShaderProgram(vertShader, fragShader) {
            this._program = TSE.gl.createProgram();
            TSE.gl.attachShader(this._program, vertShader);
            TSE.gl.attachShader(this._program, fragShader);
            TSE.gl.linkProgram(this._program);
            if (!TSE.gl.getProgramParameter(this._program, TSE.gl.LINK_STATUS)) {
                var info = TSE.gl.getProgramInfoLog(this._program);
                throw new Error(`Could not link WebGL program ${this._name} : ${info}`);
            }
        }
    }
    TSE.Shader = Shader;
})(TSE || (TSE = {}));
//# sourceMappingURL=main.js.map