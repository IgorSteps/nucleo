import { AnimatedSpriteComponentBuilder } from "./animatedSpriteComponent";
import { BitmapTextComponentBuilder } from "./bitmapTextComponent";
import { CollisionComponentBuilder } from "./collisionComponent";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { SpriteComponentBuilder } from "./spriteComponent";


export class ComponentManager {
    private static m_RegisteredBuilders: {[type: string]: IComponentBuilder} = {};
    
    private constructor(){}

    public static init() {
        ComponentManager.registerBuilder(new SpriteComponentBuilder());
        ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder());
        ComponentManager.registerBuilder(new CollisionComponentBuilder());
        ComponentManager.registerBuilder(new BitmapTextComponentBuilder());
    }

    public static registerBuilder(builder: IComponentBuilder): void {
        ComponentManager.m_RegisteredBuilders[builder.type] = builder;
    }

    public static extractComponent(json: any): IComponent {
        if(json.type !== undefined) {
            if(ComponentManager.m_RegisteredBuilders[String(json.type)] !== undefined ) {
                return ComponentManager.m_RegisteredBuilders[String(json.type)].buildFromJson(json);
            }
            throw new Error("Component manager is missing type or builder is not registered for this type");
        }
        
    }
}