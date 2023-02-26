import { vec3 } from "gl-matrix";
import { Behaviour } from "./behaviour";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { IBehaviourData } from "./IBehaviourData";

export class RotationBehaviourData implements IBehaviourData {
    public name: string;
    public rotation: number = 0.0;
    
    public setFromJson(json: any): void {
        if(json.name === undefined) {
            throw new Error("Behaviour data is missing a name.");
        }

        this.name = String(json.name);

        if(json.rotation !== undefined) {
            this.rotation = Number(json.rotation);
        }
    }

}

export class RotationBehaviourBuilder implements IBehaviourBuilder {
    public get type(): string {
        return "rotation";
    }

    public buildFromJson(json: any): IBehaviour {
        let data = new RotationBehaviourData();
        data.setFromJson(json);
        return new RotationBehaviour(data);
    }

}

export class RotationBehaviour extends Behaviour {
    private m_Rotation: number;

    constructor(data: RotationBehaviourData) {
        super(data);

        this.m_Rotation = data.rotation;
    }

    public update(dt: number) {
        this.m_Owner.Transform.Rotation += this.m_Rotation;

        super.update(dt);
    }
}