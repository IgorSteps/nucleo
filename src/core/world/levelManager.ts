import Shader from "../gl/shader";
import Level from "./level";
import { TestLevel } from "./testZone";

export default class LevelManager {

    private static m_GlobalLevelId: number = -1;
    private static m_Levels: {[id: number]: Level} = {}; 
    private static m_ActiveLevel: Level;

    private constructor(){}

    public static createLevel(name: string, description: string): number {
        LevelManager.m_GlobalLevelId++;
        let level = new Level(LevelManager.m_GlobalLevelId, name, description);
        LevelManager.m_Levels[LevelManager.m_GlobalLevelId] = level;
        return LevelManager.m_GlobalLevelId;
    }

    // TODO: temporory => remove once file loading is in place
    public static createTestLvl(): number {
        LevelManager.m_GlobalLevelId++;
        let testLvl = new TestLevel(LevelManager.m_GlobalLevelId, "test", "simple test");
        LevelManager.m_Levels[LevelManager.m_GlobalLevelId] = testLvl;
        return LevelManager.m_GlobalLevelId;
    }

    public static changeLevel(id: number): void {
        if(LevelManager.m_ActiveLevel !== undefined) {
            LevelManager.m_ActiveLevel.onDeactived();
            LevelManager.m_ActiveLevel.unload();
        }

        if(LevelManager.m_Levels[id] !== undefined) {
            LevelManager.m_ActiveLevel = LevelManager.m_Levels[id]
            LevelManager.m_ActiveLevel.onActivated();
            LevelManager.m_ActiveLevel.load();
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
}