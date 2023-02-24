import Message from "../message/message";
import { IAsset } from "./IAsset";
import IAssetLoader from "./IAssetLoader";
import ImageAssetLoader from "./imageAssetLoader";

export const MSG_ASSET_LOADER_ASSET_LOADED = "MSG_ASSET_LOADER_ASSET_LOADED::";

export default class AssetManager {

    private static m_Loaders: IAssetLoader[] = [];
    private static m_LoadedAssets: {[name: string]: IAsset} = {}; // hashtable with k = asset name, v = asset

    private constructor() {
    }

    public static init(): void {
        AssetManager.m_Loaders.push(new ImageAssetLoader());
    }

     /**
     * Registers the provided loader with this asset manager.
     * @param loader The loader to be registered.
     */
    public static registerLoader(loader: IAssetLoader): void {
        AssetManager.m_Loaders.push(loader);
    }

    public static onAssetLoaded(asset: IAsset): void {
        AssetManager.m_LoadedAssets[asset.Name] = asset;
        Message.send(MSG_ASSET_LOADER_ASSET_LOADED + asset.Name, this, asset)
    }

    public static loadAsset(name: string): void {
        let extension = name.split(".").pop().toLowerCase();
        
        // AssetManager.m_Loaders.forEach((l: IAssetLoader) => {
        //     if(l.supportedExts.indexOf(extension) !== -1)
        //     {
        //         l.loadAsset(name);
        //         return;
        //     }
        // })

        for (let l of AssetManager.m_Loaders) {
            if(l.supportedExts.indexOf(extension) !== -1) {
                l.loadAsset(name);
                return;
            }
        }

        console.warn(`Unable to load asset with extension ${extension}, because there is no loader associated with it.`)
    }

    public static isAssetLoaded(name: string): boolean {
        return AssetManager.m_LoadedAssets[name] !== undefined;
    }

    public static getAsset(name: string): IAsset {
        let asset = AssetManager.m_LoadedAssets[name];
        if (asset !== undefined){
            return asset;
        } else {
            AssetManager.loadAsset(name);
        }

        return undefined;
    }

}