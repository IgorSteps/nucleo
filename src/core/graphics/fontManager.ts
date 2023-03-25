import { BitmapFont } from "./bitmapFont";

export default class FontManager {
    private static m_Fonts: {[name: string]: BitmapFont} = {};

    public static addFont(name: string, fontFileName: string): void {
        FontManager.m_Fonts[name] = new BitmapFont(name, fontFileName);
    }

    public static getFont(name: string): BitmapFont {
        if(FontManager.m_Fonts[name] === undefined) {
            throw new Error("Font " + name + " doesn't exist")
        }

        return FontManager.m_Fonts[name];
    }

    public static load(): void {
        let keys = Object.keys(FontManager.m_Fonts);
        for (let k of keys) {
            FontManager.m_Fonts[k].load();
        }
    }

    public static updateReady(): boolean {
        let keys = Object.keys(FontManager.m_Fonts);
        for (let k of keys) {
            if(!FontManager.m_Fonts[k].isLoaded) {
                console.log("Font " + k + " is still loading")
                return false;
            }
        }

        console.log("Font are loaded")
        return true;
    }
}