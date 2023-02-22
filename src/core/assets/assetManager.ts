import { IAsset } from "./IAsset";
import IAssetLoader from "./IAssetLoader";

export default class AssetManager {

    private static m_Loaders: IAssetLoader[] = [];
    private static m_LoadedAssets: {[name: string]: IAsset} = {}; // hashtable with k = asset name, v = asset

    private constructor() {
    }

    public static init(): void {}

     /**
     * Registers the provided loader with this asset manager.
     * @param loader The loader to be registered.
     */
    public static registerLoader(loader: IAssetLoader): void {
        AssetManager.m_Loaders.push(loader);
    }

    public static loadAsset(name: string): void {}

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