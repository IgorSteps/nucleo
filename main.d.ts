declare var engine: TSE.Engine;
declare namespace TSE {
    class Engine {
        private _canvas;
        private _shader;
        constructor();
        start(): void;
        resize(): void;
        private loop;
        private loadShaders;
    }
}
declare namespace TSE {
    var gl: WebGL2RenderingContext;
    class GLUtilities {
        static init(elementId?: string): HTMLCanvasElement;
    }
}
declare namespace TSE {
    class Shader {
        private _name;
        private _program;
        constructor(name: string, vertSource: string, fragSource: string);
        get name(): string;
        use(): void;
        private loadShader;
        private createShaderProgram;
    }
}
