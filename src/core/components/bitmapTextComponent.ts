import { vec3 } from "gl-matrix";
import Shader from "../gl/shader";
import { BitmapText } from "../graphics/bitmapText";
import Component from "./component";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class BitmapTextComponentData implements IComponentData{
    public name: string;
    public fontName: string;
    public origin: vec3 = vec3.create();
    public text: string;

    public setFromJson(json: any): void {
        if(json.name !== undefined) {
            this.name = String(json.name);
        }

        if(json.fontName !== undefined) {
            this.fontName = String(json.fontName);
        }

        if(json.text !== undefined) {
            this.text = String(json.text);
        }

        if(json.origin !== undefined) {
            vec3.set(this.origin, json.origin.x, json.origin.y, json.origin.z);
        }
    }
}

export class BitmapTextComponentBuilder implements IComponentBuilder{

    public get type(): string {
        return "bitmapFont";
    }
    
    public buildFromJson(json: any): IComponent {
        let data = new BitmapTextComponentData();
        data.setFromJson(json);
        return new BitmapTextComponent(data);
    }
}

export class BitmapTextComponent extends Component {
    private m_BitmapText: BitmapText;
    private m_FontName: string;

    constructor(data: BitmapTextComponentData) {
        super(data);
        this.m_FontName = data.fontName;
        this.m_BitmapText = new BitmapText(this.name, this.m_FontName)

        if(vec3.equals(data.origin, vec3.create())) {
            vec3.copy(this.m_BitmapText.origin, data.origin)
        }

        this.m_BitmapText.text = data.text;
    }

    public load(): void {
        this.m_BitmapText.load();
        
    }

    public update(dt: number): void {
        this.m_BitmapText.update(dt);
    }

    public render(shader: Shader): void {
        this.m_BitmapText.draw(shader, this.m_Owner.worldMatrix);
        super.render(shader)
    }
}