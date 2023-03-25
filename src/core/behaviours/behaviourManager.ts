import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { KeyBoardMovementBehaviourBuilder } from "./keyBoardMovementBehaviour";
import { MouseClickBehaviourBuilder } from "./mouseClickBehaviour";
import { PlayerBehaviourBuilder } from "./playerBehaviour";
import { RotationBehaviour, RotationBehaviourBuilder } from "./rotationBehaviour";
import { ScrollBehaviour, ScrollBehaviourBuilder } from "./scrollBehaviour";
import { VisibilityOnMessageBehaviorBuilder } from "./visibilityOnMessagBehaviour";



export class BehaviourManager {
    private static m_RegisteredBuilders: {[type: string]: IBehaviourBuilder} = {};
    
    private constructor(){}

    public static init() {
        BehaviourManager.registerBuilder(new RotationBehaviourBuilder());
        BehaviourManager.registerBuilder(new KeyBoardMovementBehaviourBuilder());
        BehaviourManager.registerBuilder(new PlayerBehaviourBuilder());
        BehaviourManager.registerBuilder(new ScrollBehaviourBuilder());
        BehaviourManager.registerBuilder(new MouseClickBehaviourBuilder());
        BehaviourManager.registerBuilder(new VisibilityOnMessageBehaviorBuilder());
    }

    public static registerBuilder(builder: IBehaviourBuilder): void {
        BehaviourManager.m_RegisteredBuilders[builder.type] = builder;
    }

    public static extractBehaviour(json: any): IBehaviour {
        if(json.type !== undefined) {
            if(BehaviourManager.m_RegisteredBuilders[String(json.type)] !== undefined ) {
                return BehaviourManager.m_RegisteredBuilders[String(json.type)].buildFromJson(json);
            }

            throw new Error("Behaviour manager is missing type or builder is not registered for this type " + json.type);
        }
    }
}