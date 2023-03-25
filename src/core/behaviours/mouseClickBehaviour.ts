import { MouseContext } from "../input/inputManager";
import IMessageHandler from "../message/IMessageHandler";
import Message from "../message/message";
import { Behaviour } from "./behaviour";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { IBehaviourData } from "./IBehaviourData";

export class MouseClickBehaviourData implements IBehaviourData {
    public name: string;
    public width: number;
    public height: number;
    public messageCode: string;

    public setFromJson(json: any): void {
        if (json.name === undefined) {
            throw new Error("Name must be defined in behavior data.");
        }

        this.name = String(json.name);

        if (json.width === undefined) {
            throw new Error("width must be defined in behavior data.");
        } else {
            this.width = Number(json.width);
        }

        if (json.height === undefined) {
            throw new Error("height must be defined in behavior data.");
        } else {
            this.height = Number(json.height);
        }

        if (json.messageCode === undefined) {
            throw new Error("messageCode must be defined in behavior data.");
        } else {
            this.messageCode = String(json.messageCode);
        }
    }
}

export class MouseClickBehaviourBuilder implements IBehaviourBuilder {
    public get type(): string {
        return "mouseClick";
    }

    public buildFromJson(json: any): IBehaviour {
        let data = new MouseClickBehaviourData();
        data.setFromJson(json);
        return new MouseClickBehaviour(data);
    }
}

export class MouseClickBehaviour extends Behaviour implements IMessageHandler {

    private m_Width: number;
    private m_Height: number;
    private m_MessageCode: string;

    constructor(data: MouseClickBehaviourData) {
        super(data);

        this.m_Width = data.width;
        this.m_Height = data.height;
        this.m_MessageCode = data.messageCode;
        Message.subscribe("MOUSE_UP", this);
    }

    public onMessage(message: Message): void {
        if (message.Code === "MOUSE_UP") {
            if (!this.m_Owner.isVisible) {
                return;
            }
            let context = message.Context as MouseContext;
            let worldPos = this.m_Owner.getWorldPosition();
            let extentsX = worldPos[0] + this.m_Width;
            let extentsY = worldPos[1]+ this.m_Height;
            if (context.position[0] >= worldPos[0] && context.position[0] <= extentsX &&
                context.position[1] >= worldPos[1] && context.position[1] <= extentsY) {
                // Send the configured message.
                Message.send(this.m_MessageCode, this);
            }
        }
    }
}