import { IAsset } from "./IAsset";

/** 
 * Responsible for loading specific asset type
 * and populating asset data
 */
export default interface IAssetLoader{ 

    /** Supported file extensions eg. png */
    readonly supportedExts: string[];
    loadAsset(assetName: string): void;
}