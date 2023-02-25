import Shader from "../gl/shader";
import Sprite from "../graphics/sprite";
import Component from "./component";

export default class SpriteComponent extends Component {
    private m_Sprite: Sprite;

    constructor(name: string, materialName: string, ) {
        super(name);

        this.m_Sprite = new Sprite(name, materialName);
    }

    public load(): void {
        this.m_Sprite.load();    
    }

    public render(shader: Shader): void {
        this.m_Sprite.draw(shader, this.m_Owner.worldMatrix);

       
        super.render(shader);
    }
}