import AssetManager from "./assetManager";
import { IAsset } from "./IAsset";
import IAssetLoader from "./IAssetLoader";

export class JsonAsset implements IAsset {
    public readonly Name: string;
    public readonly Data: any;

    constructor(name:string, data: any) {
        this.Name = name;
        this.Data = data;
    }

}

export default class JsonAssetLoader implements IAssetLoader{
    public get supportedExts(): string[] {
        return ["json"];
    }

    public loadAsset(assetName: string): void {
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open("GET", assetName);
        request.addEventListener("load", this.onJsonLoaded.bind(this, assetName, request))
        request.send();
    }
    
    private onJsonLoaded(name: string, request: XMLHttpRequest): void {
        console.log("onJsonLoaded loaded", name, request);

        if(request.readyState === request.DONE){
            let json = JSON.parse(request.responseText);
            let asset: JsonAsset = new JsonAsset(name, json);
            AssetManager.onAssetLoaded(asset);
        }
    }

}