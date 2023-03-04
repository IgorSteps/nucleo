import { vec3 } from "gl-matrix";
import Shader from "../gl/shader";
import Sprite from "../graphics/sprite";
import Component from "./component";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class SpriteComponentData implements IComponentData{
    public name: string;
    public materialName: string;
    public origin: vec3 = vec3.create();

    public setFromJson(json: any): void {
        if(json.name !== undefined) {
            this.name = String(json.name);
        }

        if(json.name !== undefined) {
            this.materialName = String(json.materialName);
        }

        if(json.origin !== undefined) {
            vec3.set(this.origin, json.origin.x, json.origin.y, json.origin.z);
        }
    }
}

export class SpriteComponentBuilder implements IComponentBuilder {
    public get type(): string {
        return "sprite"
    }

    public buildFromJson(json: any): IComponent {
        let data = new SpriteComponentData();
        data.setFromJson(json);
        return new SpriteComponent(data);
    }

}

export default class SpriteComponent extends Component {
    private m_Sprite: Sprite;

    constructor(data: SpriteComponentData) {
        super(data);

        this.m_Sprite = new Sprite(this.name, data.materialName);
        if(!vec3.equals(vec3.create(), data.origin)) {
            vec3.set(this.m_Sprite.origin, data.origin[0], data.origin[1], data.origin[2]);
        }
    }

    public load(): void {
        this.m_Sprite.load();    
    }

    public render(shader: Shader): void {
        this.m_Sprite.draw(shader, this.m_Owner.worldMatrix);

       
        super.render(shader);
    }
}

// TODO: Why isn't this method call executed? 
// Had to make an ComponentManager.init() that's called in the engine.ts
// ComponentManager.registerBuilder(new SpriteComponentBuilder());


