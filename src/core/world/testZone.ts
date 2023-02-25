import Shader from "../gl/shader";
import Sprite from "../graphics/sprite";
import Level from "./level";

export class TestLevel extends Level {
    private m_Sprite: Sprite;

    public load(): void {
        console.log("Test level loaded")
        this.m_Sprite = new Sprite("test", "crate");
        this.m_Sprite.load();
        this.m_Sprite.m_Position[0] = 20;
        
        super.load()

    }

    public render(shader: Shader): void {
        this.m_Sprite.draw(shader);
       
        super.render(shader);
    }
}