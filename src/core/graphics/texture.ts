import AssetManager, { MSG_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import { ImageAsset } from "../assets/imageAssetLoader";
import { gl } from "../gl/gl";
import IMessageHadnler from "../message/IMessageHandler";
import Message from "../message/message";


const LEVEL: number = 0;
const BORDER: number = 0;
const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 255]);

export default class Texture implements IMessageHadnler{

    private m_Name: string;
    private m_Handle: WebGLTexture;
    private m_IsLoaded: boolean = false;

    private m_Width: number;
    private m_Height: number;

    constructor(name:string, w: number= 1, h:number= 1) {
        this.m_Name = name;
        this.m_Width = w;
        this.m_Height = h;

        
        this.m_Handle = gl.createTexture();
        Message.subscribe(MSG_ASSET_LOADER_ASSET_LOADED + this.m_Name, this);

        this.bind()


        gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, 1, 1, BORDER, gl.RGBA, gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);

        let asset = AssetManager.getAsset(this.m_Name) as ImageAsset;
        if(asset !== undefined) {
            this.loadTextureFromAsset(asset);
        }
    }
    
    public destroy(): void {
        gl.deleteTexture(this.m_Handle);
    }

    public get name(): string {
        return this.m_Name;
    }
    
    public get isLoaded(): boolean {
        return this.m_IsLoaded;
    }
    
    public get width(): number {
        return this.m_Width;
    }
    
    public get height(): number {
        return this.m_Height;
    }
    
    public bind(): void {
        gl.bindTexture(gl.TEXTURE_2D, this.m_Handle);
    } 

    public unbind(): void {
        gl.bindTexture(gl.TEXTURE_2D, undefined);
    }


    /**
     * Activates the provided texture unit and binds this texture.
     * @param textureUnit The texture unit to activate on. DEFAULT = 0
     */
    public activateAndBind(textureUnit: number = 0): void {
         gl.activeTexture(gl.TEXTURE0 + textureUnit);
         this.bind();
    }
    
    public onMessage(message: Message): void {
        if(message.Code === MSG_ASSET_LOADER_ASSET_LOADED + this.m_Name) {
            console.log("loaded:", message.Context)
            this.loadTextureFromAsset(message.Context as ImageAsset);
        }

    }

    private loadTextureFromAsset(asset: ImageAsset): void {
        this.m_Width = asset.width;
        this.m_Height = asset.height;

        this.bind();

        // Set the parameters so we don't need mips and so we're not filtering
        // and we don't repeat at the edges
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.Data);

        this.m_IsLoaded = true;
    }

}