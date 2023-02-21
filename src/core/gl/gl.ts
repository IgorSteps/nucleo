
    /**
     * WebGL2 rendering context
     */
    export var gl: WebGL2RenderingContext;

    /**
     * Responsible for setting up WebGL2 rendering context
     */
    export class GLUtilities {

        /**
         * Init WebGL2, optionally using element id
         * @param elementId The id of the element(optional)
         * @returns Canvas html element
         */
        public static init(elementId?: string): HTMLCanvasElement {
            let canvas: HTMLCanvasElement;

            if(elementId !== undefined) {
                canvas = document.getElementById(elementId) as HTMLCanvasElement;
                if(canvas === undefined){
                    throw new Error("Cannot find a canvas element of id: "+ elementId);
                }
            } else {
                canvas = document.createElement("canvas") as HTMLCanvasElement;
                document.body.appendChild(canvas)
            }

            gl = canvas.getContext("webgl2");
            if (gl === undefined) {
                throw new Error("Unable to initilise WebGL2")
            }

            return canvas;
        }
    }
