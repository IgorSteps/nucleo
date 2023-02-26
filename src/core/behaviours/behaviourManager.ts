import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { RotationBehaviour, RotationBehaviourBuilder } from "./rotationBehaviour";



export class BehaviourManager {
    private static m_RegisteredBuilders: {[type: string]: IBehaviourBuilder} = {};
    
    private constructor(){}

    public static init() {
        BehaviourManager.registerBuilder(new RotationBehaviourBuilder());
    }

    public static registerBuilder(builder: IBehaviourBuilder): void {
        BehaviourManager.m_RegisteredBuilders[builder.type] = builder;
    }

    public static extractBehaviour(json: any): IBehaviour {
        if(json.type !== undefined) {
            if(BehaviourManager.m_RegisteredBuilders[String(json.type)] !== undefined ) {
                return BehaviourManager.m_RegisteredBuilders[String(json.type)].buildFromJson(json);
            }

            throw new Error("Behaviour manager is missing type or builder is not registered for this type");
        }
    }
}