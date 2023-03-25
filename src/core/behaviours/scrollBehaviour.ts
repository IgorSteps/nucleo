import { vec2, vec3 } from "gl-matrix";
import IMessageHadnler from "../message/IMessageHandler";
import { Behaviour } from "./behaviour";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { IBehaviourData } from "./IBehaviourData";
import Message from "../message/message";

export class ScrollBehaviourData implements IBehaviourData {
    public name: string;
    public velocity: vec2 = vec2.create();
    public minPosition: vec2 = vec2.create();
    public resetPosition: vec2 = vec2.create();
    public minResetY: number;
    public maxResetY: number;
    public startMessage: string;
    public stopMessage: string;
    public resetMessage: string;

    public setFromJson(json: any): void {
        if(json.name === undefined) {
            throw new Error("Behaviour is missing a name")
        }

        this.name = String(json.name);

        if(json.resetMessage !== undefined) {
            this.resetMessage = String(json.resetMessage);
        }

        if(json.startMessage !== undefined) {
            this.startMessage = String(json.startMessage);
        }

        if(json.stopMessage !== undefined) {
            this.stopMessage = String(json.stopMessage);
        }
        
        if(json.velocity !== undefined) {
            vec2.set(this.velocity, json.velocity.x, json.velocity.y);
        } else {
            throw new Error("Behaviour is missing a velocity")
        }

        if(json.minPosition !== undefined) {
            vec2.set(this.minPosition, json.minPosition.x, json.minPosition.y);
        } else {
            throw new Error("Behaviour is missing a minPosition")
        }

        if(json.resetPosition !== undefined) {
            vec2.set(this.resetPosition, json.resetPosition.x, json.resetPosition.y);
        } else {
            throw new Error("Behaviour is missing a resetPosition")
        }

        if (json.minResetY !== undefined) {
            this.minResetY = Number(json.minResetY);
        }

        if (json.maxResetY !== undefined) {
            this.maxResetY = Number(json.maxResetY);
        }
        
    }
}

export class ScrollBehaviourBuilder implements IBehaviourBuilder {
    public get type(): string {
        return "scroll";
    }

    public buildFromJson(json: any): IBehaviour {
        let data = new ScrollBehaviourData();
        data.setFromJson(json);
        return new ScrollBehaviour(data);
    }

}

export class ScrollBehaviour extends Behaviour implements IMessageHadnler{

    private m_Velocity: vec2 = vec2.create();
    private m_MinPosition: vec2 = vec2.create();
    private m_ResetPosition: vec2 = vec2.create();
    private m_MinResetY: number;
    private m_MaxResetY: number;
    private m_StartMessage: string;
    private m_StopMessage: string;
    private m_ResetMessage: string;
    private m_IsScrolling: boolean = false;
    private m_InitialPosition: vec2 = vec2.create();

    constructor(data: ScrollBehaviourData) {
        super(data);

        vec2.copy(this.m_Velocity, data.velocity);
        vec2.copy(this.m_MinPosition, data.minPosition);
        vec2.copy(this.m_ResetPosition, data.resetPosition);

        if (data.minResetY !== undefined) {
            this.m_MinResetY = data.minResetY;
        }

        if (data.maxResetY !== undefined) {
            this.m_MaxResetY = data.maxResetY;
        }

        this.m_StartMessage = data.startMessage;
        this.m_StopMessage = data.stopMessage;
        this.m_ResetMessage = data.resetMessage;
    }

    public updateReady(): void {
        super.updateReady();
        
        if(this.m_StartMessage !== undefined) {
            Message.subscribe(this.m_StartMessage, this)
        }

        if(this.m_ResetMessage !== undefined) {
            Message.subscribe(this.m_ResetMessage, this)
        }

        if(this.m_StopMessage !== undefined) {
            Message.subscribe(this.m_StopMessage, this)
        }

       vec2.copy(this.m_InitialPosition, vec2.fromValues(this.m_Owner.Transform.Position[0], this.m_Owner.Transform.Position[1]));
    }

    public update(dt: number): void {
        if(this.m_IsScrolling) {
            let clone: vec2 = vec2.clone(this.m_Velocity);
            let scale: vec2 = vec2.scale(clone, clone, dt/1000);
            let convertedToVec3: vec3 = vec3.fromValues(scale[0], scale[1], 0);
            vec3.add(this.m_Owner.Transform.Position, this.m_Owner.Transform.Position, convertedToVec3);

            let scrollY = this.m_MinResetY !== undefined && this.m_MaxResetY !== undefined;
            if (this.m_Owner.Transform.Position[0] <= this.m_MinPosition[0] &&
                (scrollY || (!scrollY && this.m_Owner.Transform.Position[1] <= this.m_MinPosition[1]))) {

                this.reset();
            }
        }
    }

    public onMessage(msg: Message): void {
        if(msg.Code === this.m_StartMessage) {
            this.m_IsScrolling = true;
        } else if(msg.Code === this.m_StopMessage) {
            this.m_IsScrolling = false;
        } else if(msg.Code === this.m_ResetMessage) {
            this.initial();
        }
    }

    private reset(): void {
        vec3.copy(this.m_Owner.Transform.Position, vec3.fromValues(this.m_ResetPosition[0],this.m_ResetPosition[1], 0))
        if (this.m_MinResetY !== undefined && this.m_MaxResetY !== undefined) {
            vec3.set(this.m_Owner.Transform.Position, this.m_ResetPosition[0], this.getRandomY(), 0);
        } else {
            vec3.copy(this.m_Owner.Transform.Position, vec3.fromValues(this.m_ResetPosition[0],this.m_ResetPosition[1], 0))
        }
    }

    private getRandomY(): number {
        // Inclusive of the min and max set in the data.
        return Math.floor(Math.random() * (this.m_MaxResetY - this.m_MinResetY + 1)) + this.m_MinResetY;
    }

    private initial(): void {
        vec3.copy(this.m_Owner.Transform.Position, vec3.fromValues(this.m_InitialPosition[0],this.m_InitialPosition[1], 0))
    }
}