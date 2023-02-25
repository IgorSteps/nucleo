import AssetManager, { MSG_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import { JsonAsset } from "../assets/jsonAssetLoader";
import Shader from "../gl/shader";
import IMessageHadnler from "../message/IMessageHandler";
import Message from "../message/message";
import Level from "./level";
import { TestLevel } from "./testZone";

export default class LevelManager implements IMessageHadnler {

    private static m_GlobalLevelId: number = -1;
    //private static m_Levels: {[id: number]: Level} = {}; 
    private static m_RegisteredLevels: {[id: number]: string} = {};
    private static m_ActiveLevel: Level;
    private static m_Instance: LevelManager;


    private constructor(){}

    public static init(): void {
        LevelManager.m_Instance = new LevelManager();

        // TODO: temporary
        LevelManager.m_RegisteredLevels[0] = "../../assets/levels/testLevel.json"
        // src/assets/levels/testLevel.json
    }

  

    public static changeLevel(id: number): void {
        if(LevelManager.m_ActiveLevel !== undefined) {
            LevelManager.m_ActiveLevel.onDeactived();
            LevelManager.m_ActiveLevel.unload();
            LevelManager.m_ActiveLevel = undefined;
        }

        if(LevelManager.m_RegisteredLevels[id] !== undefined) {
            if(AssetManager.isAssetLoaded(LevelManager.m_RegisteredLevels[id])) {
                let asset = AssetManager.getAsset(LevelManager.m_RegisteredLevels[id]);
                LevelManager.loadLevel(asset);
            } else {
                Message.subscribe(MSG_ASSET_LOADER_ASSET_LOADED + LevelManager.m_RegisteredLevels[id],
                    LevelManager.m_Instance);
                AssetManager.loadAsset(LevelManager.m_RegisteredLevels[id]);
            }
        } else {
            throw new Error(`Level with id ${id} doesn't exist.`)
        }
    }

    public static update(dt: number) {
        if(LevelManager.m_ActiveLevel !== undefined) {
            LevelManager.m_ActiveLevel.update(dt);
        }
    }

    public static render(shader: Shader) {
        if(LevelManager.m_ActiveLevel !== undefined) {
            LevelManager.m_ActiveLevel.render(shader);
        }
    }

    private static loadLevel(asset: JsonAsset): void {
        let levelData = asset.Data;
        let levelID: number;
        if(levelData.id === undefined) {
            throw new Error("Level id missing");
        } else {
            levelID = Number(levelData.id);
        }

        let levelName: string;
        if(levelData.name === undefined) {
            throw new Error("Level name missing");
        } else {
            levelName = String(levelData.name);
        }

        let levelDesc: string;
        if(levelData.description !== undefined) { 
            levelDesc = String(levelData.description);
        }

        LevelManager.m_ActiveLevel = new Level(levelID, levelName, levelDesc);
        LevelManager.m_ActiveLevel.init(levelData);
        LevelManager.m_ActiveLevel.onActivated();
        LevelManager.m_ActiveLevel.load();
    }

    public onMessage(message: Message): void{
        if(message.Code.indexOf(MSG_ASSET_LOADER_ASSET_LOADED)) {
            let asset = message.Context as JsonAsset;
            LevelManager.loadLevel(asset);
        }
    }
}