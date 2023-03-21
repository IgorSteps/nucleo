import AssetManager from "./assetManager";
import { IAsset } from "./IAsset";
import IAssetLoader from "./IAssetLoader";

export default class TextAsset implements IAsset {
    public readonly Name: string;
    public readonly Data: any;

    constructor(name: string, data: string) {
        this.Name = name;
        this.Data = data;
    }
}

export class TextAssetLoader implements IAssetLoader{
    supportedExts: string[];

    public get supportedExtenions(): string[] {
        return ["txt"];
    }

    loadAsset(assetName: string): void {
        let request = new XMLHttpRequest();
        request.open("GET", assetName);
        request.addEventListener("load", this.onTextLoaded.bind(this, assetName, request));
        request.send();
    }

    private onTextLoaded(assetName: string, request: XMLHttpRequest): void {
        console.debug("onTextLoaded: assetName/request", assetName, request);

        if(request.readyState === request.DONE) {
            let asset = new TextAsset(assetName, request.responseText);
            AssetManager.onAssetLoaded(asset);
        }
    } 
}