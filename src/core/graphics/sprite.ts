import {GLBuffer, AttributeInfo} from '../gl/glBuffer'
    export default class Sprite {

        private m_Name: string;
        private m_Width: number;
        private m_Height: number;

        private m_Buffer: GLBuffer;

        constructor(name: string, width: number = 100, height: number = 100) {
            this.m_Name = name;
            this.m_Height = height;
            this.m_Width = width;

        }


        public load(): void {
            this.m_Buffer = new GLBuffer(3);
            
            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.size = 3;
            positionAttribute.offset = 0;
            this.m_Buffer.addAttributeLocation(positionAttribute);
            
            this.m_Buffer.bind();
            
            let vertices = [
                0, 0, 0,
                0, .5, 0,
                .5, .5, 0,

                .5, .5, 0,
                .5, 0, 0,
                0, 0, 0,
            ];
            this.m_Buffer.pushBackData(vertices)
            this.m_Buffer.upload(); 

            this.m_Buffer.unbind();
        }

        public update(dt: number): void {

        }

        public draw(): void {
            this.m_Buffer.bindVAO();
            this.m_Buffer.draw(); 
        }
    }