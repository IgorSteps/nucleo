import { vec2 } from "gl-matrix";
import { max } from "mathjs";
import AssetManager, { MSG_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import TextAsset from "../assets/textAssetLoader";
import IMessageHadnler from "../message/IMessageHandler";
import Message from "../message/message";

class FontUtils{
    public static extractFieldValue(field: string): string {
        return field.split("=")[1];
    }
}

export class FontGlyph {
    public id: number;
    public x: number;
    public y: number;
    public width: number;
    public height: number; 
    public xOffset:number;
    public yOffset: number;
    public xAdvance: number;
    public page: number;
    public chnl: number; 

    public static fromFields(fields: string[]): FontGlyph {
        let glyph: FontGlyph = new FontGlyph();

        glyph.id = Number(FontUtils.extractFieldValue(fields[1]));
        glyph.x = Number(FontUtils.extractFieldValue(fields[2]));
        glyph.y = Number(FontUtils.extractFieldValue(fields[3]));
        glyph.width = Number(FontUtils.extractFieldValue(fields[4]));
        glyph.height = Number(FontUtils.extractFieldValue(fields[5])); 
        glyph.xOffset = Number(FontUtils.extractFieldValue(fields[6]));
        glyph.yOffset = Number(FontUtils.extractFieldValue(fields[7]));
        glyph.xAdvance = Number(FontUtils.extractFieldValue(fields[8]));
        glyph.page = Number(FontUtils.extractFieldValue(fields[9]));
        glyph.chnl = Number(FontUtils.extractFieldValue(fields[10])); 

        return glyph;
    }
}

export class BitmapFont implements IMessageHadnler{
    private m_Name: string;
    private m_FontFileName: string;
    private m_AssetLoaded: boolean = false;
    private m_ImageFile: string;
    private m_Glyphs: {[id: number]: FontGlyph} = {};
    private m_Size: number;
    private m_ImageWidth: number; 
    private m_ImageHeight: number; 


    public get name(): string {
        return this.m_Name;
    }

    public get size(): number {
        return this.m_Size;
    }

    public get width(): number {
        return this.m_ImageWidth;
    }

    public get height(): number {
        return this.m_ImageHeight;
    }

    public get textureName(): string {
        return this.m_ImageFile;
    }

    public get isLoaded(): boolean {
        return this.m_AssetLoaded;
    }

    public load(): void {
        let asset = AssetManager.getAsset(this.m_FontFileName);
        if(asset !== undefined) {
            this.processFontFile(asset.Data);
        } else {
            Message.subscribe(MSG_ASSET_LOADER_ASSET_LOADED+this.m_FontFileName, this)
        }
    } 

    public onMessage(msg: Message): void {
        if(msg.Code === MSG_ASSET_LOADER_ASSET_LOADED+this.m_FontFileName) {
            this.processFontFile((msg.Context as TextAsset).Data);
        }

    }

    public getGlyph(char: string): FontGlyph {
        let code = char.charCodeAt(0);
        // replace unknow chars with '?'
        code = this.m_Glyphs[code] === undefined ? 63 : code;

        return this.m_Glyphs[code];
    }

    public measureText(text: string): vec2 {
        let size: vec2 = vec2.create();
        let maxX = 0;
        let x = 0;
        let y = 0;

       for(let c of text){
            switch (c) {
                case "\n":
                    if(x > maxX) {
                        maxX = x;
                    }
                    x = 0;
                    y += this.size;
                    break;
                default:
                    x += this.getGlyph(c).xAdvance
                    break;
            }
       }
        
       vec2.set(size, maxX, y);
        return size;
    } 

    private processFontFile(data: string): void {
        let charCount: number = 0;
        let lines: string[] = data.split('\n');
        for (let l of lines) {
            // clean the line
            let data = l.replace(/\s\s+/g, ' ');
            let fields = data.split(" ");

            switch(fields[0]) {
                case "info": 
                    this.m_Size = Number(FontUtils.extractFieldValue(fields[2]));
                    break;
                case "common":
                    this.m_ImageWidth = Number(FontUtils.extractFieldValue(fields[3]));
                    this.m_ImageHeight = Number(FontUtils.extractFieldValue(fields[4]));
                    break;
                case "page":
                    {
                        let id: number = Number(FontUtils.extractFieldValue(fields[1]));

                        this.m_ImageFile = FontUtils.extractFieldValue(fields[2]);

                        // Strip quotes.
                        this.m_ImageFile = this.m_ImageFile.replace(/"/g, "");

                        // Prepend the path to the image name. TODO: This should be configurable.
                        this.m_ImageFile = ("assets/fonts/" + this.m_ImageFile).trim();
                    }
                    break;
                case "chars": 
                    charCount = Number(FontUtils.extractFieldValue(fields[1]));
                    charCount++;
                    break;
                case "char":
                    {
                        let glyph = FontGlyph.fromFields(fields);
                        this.m_Glyphs[glyph.id] = glyph;
                    }
                    break;
            }
        }

         // Verify the loaded glyphs
         let actualGlyphCount = 0;

         // Only count properties
         let keys = Object.keys(this.m_Glyphs);
         for (let key of keys) {
             if (this.m_Glyphs.hasOwnProperty(key)) {
                 actualGlyphCount++;
             }
         }

         if (actualGlyphCount !== charCount) {
             throw new Error(`Font file reported existence of ${charCount} glyphs, but only ${actualGlyphCount} were found.`);
         }

         this.m_AssetLoaded = true;
    }
}
