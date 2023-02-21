   import {gl} from './gl'
   /**
     * Struct with GLBuffer attribute info
     */
    export class AttributeInfo {
        location: number;
        size: number;
        offset: number;
    }


    export class GLBuffer {

        private m_VAO: WebGLVertexArrayObject

        private m_HasAttributeLocation: boolean = false;
        private m_ElementSize: number;
        private m_Stride: number;
        private m_GLBuffer: WebGLBuffer;
        private m_TargetBufferType: number;
        private m_DataType: number;
        private m_Mode: number;
        private m_TypeSize: number;

        private m_Data: number[] = [];
        private m_Attributes: AttributeInfo[] = [];

        /**
         * Creates new gl buffer
         * @param elementSize - Size of each element in this buffer
         * @param dataType - Data type of this buffer, DEFAULT = FLOAT
         * @param targetBufferType Target buffer type of this buffer , DEFAULT = gl.ARRAY_BUFFER
         * @param mode Drawing mode of this buffer, DEFAULT = gl.TRIANGELS
         */
        constructor(elementSize: number, dataType: number = gl.FLOAT, targetBufferType: number = gl.ARRAY_BUFFER, mode: number =  gl.TRIANGLES) {
            this.m_ElementSize = elementSize;
            this.m_DataType = dataType;
            this.m_TargetBufferType = targetBufferType;
            this.m_Mode = mode;

            // determine byte size
            switch(this.m_DataType) {
                case gl.FLOAT:
                case gl.INT:
                case gl.UNSIGNED_INT:
                    this.m_TypeSize = 4;
                    break;
                case gl.SHORT:
                case gl.UNSIGNED_SHORT:
                    this.m_TypeSize = 2;
                    break;
                case gl.BYTE:
                case gl.UNSIGNED_BYTE:
                    this.m_TypeSize = 1;
                    break;
                default:
                    throw new Error(`Unrecognised data type ${dataType.toString()}`)
            }

            this.m_Stride = this.m_ElementSize * this.m_TypeSize;
            this.m_GLBuffer = gl.createBuffer();
            this.m_VAO = gl.createVertexArray();
        }

        public destroy(): void {
            gl.deleteBuffer(this.m_GLBuffer);
        } 

        /**
         * Bind to this buffer
         * @param normalized DEFAULT = false
         */
        public bind(normalized: boolean = false): void {
            gl.bindVertexArray(this.m_VAO);
            gl.bindBuffer(this.m_TargetBufferType, this.m_GLBuffer);

            if (this.m_HasAttributeLocation) {
                this.m_Attributes.forEach((a) => {
                    gl.vertexAttribPointer(a.location, a.size, this.m_DataType,  normalized, this.m_Stride, a.offset * this.m_TypeSize);
                    gl.enableVertexAttribArray(a.location);
                })
            } 
        }

        public bindVAO():void {
            gl.bindVertexArray(this.m_VAO);
        }

        public unbind(): void {
            gl.bindBuffer(gl.ARRAY_BUFFER, undefined);
            gl.bindVertexArray(null);
        }

        public addAttributeLocation(info: AttributeInfo): void {
            this.m_HasAttributeLocation = true;
            this.m_Attributes.push(info)
        }

        /**
         * Pushes data to this m_GLBuffer
         * @param data 
         */
        public pushBackData(data: number[]): void {
          data.forEach( (d) => {
            this.m_Data.push(d);
          })
        }

        /**
         * Upload data to the GPU
         */
        public upload():void {
            gl.bindBuffer(this.m_TargetBufferType, this.m_GLBuffer);

            let bufferData: ArrayBuffer;
            switch(this.m_DataType) {
                case gl.FLOAT:
                    bufferData = new Float32Array(this.m_Data);
                    break;
                case gl.INT:
                    bufferData = new Int32Array(this.m_Data);
                    break;
                case gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this.m_Data);
                    break;
                case gl.SHORT:
                    bufferData = new Int16Array(this.m_Data);
                    break;
                case gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this.m_Data);
                    break;
                case gl.BYTE: 
                    bufferData = new Int8Array(this.m_Data);
                    break;
                case gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this.m_Data);
                    break;
            }


            gl.bufferData(this.m_TargetBufferType, bufferData, gl.STATIC_DRAW);
        }

        /**
         * Draws this buffer
         */
        public draw():void {
            if(this.m_TargetBufferType === gl.ARRAY_BUFFER) {
                gl.drawArrays(this.m_Mode, 0, this.m_Data.length / this.m_ElementSize);
            } else if(this.m_TargetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
                gl.drawElements(this.m_Mode, this.m_Data.length, this.m_DataType, 0);
            }
        }

    }