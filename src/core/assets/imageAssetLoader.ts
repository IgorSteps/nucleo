import AssetManager from "./assetManager";
import { IAsset } from "./IAsset";
import IAssetLoader from "./IAssetLoader";

export class ImageAsset implements IAsset {
    public readonly Name: string;
    public readonly Data: HTMLImageElement;

    constructor(name:string, data: HTMLImageElement) {
        this.Name = name;
        this.Data = data;
    }

    public get width(): number {
        return this.Data.width;
    }

    public get height(): number {
        return this.Data.height;
    }
}

export default class ImageAssetLoader implements IAssetLoader{
    public get supportedExts(): string[] {
        return ["png", "gif", "jpg"];
    }

    public loadAsset(assetName: string): void {
        let imageElm: HTMLImageElement = new Image();
        imageElm.onload = this.onImageLoaded.bind(this, assetName, imageElm);
        imageElm.src = assetName;
    }
    
    private onImageLoaded(name: string, image: HTMLImageElement): void {
        console.log(`onImage loaded ${name}/${image}`);
        let asset: ImageAsset = new ImageAsset(name, image);
        AssetManager.onAssetLoaded(asset);
    }

}