import IMessageHandler from "../message/IMessageHandler";
import Message from "../message/message";
import { Behaviour } from "./behaviour";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { IBehaviourData } from "./IBehaviourData";

export class VisibilityOnMessageBehaviorData implements IBehaviourData {
    public name: string;
    public messageCode: string;
    public visible: boolean;

    public setFromJson(json: any): void {
        if (json.messageCode === undefined) {
            throw new Error("VisibilityOnMessageBehaviorData requires 'messageCode' to be defined.");
        } else {
            this.messageCode = String(json.messageCode);
        }

        if (json.visible === undefined) {
            throw new Error("VisibilityOnMessageBehaviorData requires 'visible' to be defined.");
        } else {
            this.visible = Boolean(json.visible);
        }
    }
}

export class VisibilityOnMessageBehaviorBuilder implements IBehaviourBuilder {

    public get type(): string {
        return "visibilityOnMessage";
    }

    public buildFromJson(json: any): IBehaviour {
        let data = new VisibilityOnMessageBehaviorData();
        data.setFromJson(json);
        return new VisibilityOnMessageBehavior(data);
    }
}

export class VisibilityOnMessageBehavior extends Behaviour implements IMessageHandler {

    private m_MessageCode: string;
    private m_Visible: boolean;

    constructor(data: VisibilityOnMessageBehaviorData) {
        super(data);

        this.m_MessageCode = data.messageCode;
        this.m_Visible = data.visible;

        Message.subscribe(this.m_MessageCode, this);
    }

    public onMessage(message: Message): void {
        if (message.Code === this.m_MessageCode) {
            this.m_Owner.isVisible = this.m_Visible;
        }
    }
}