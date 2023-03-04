import { vec3 } from "gl-matrix";
import InputManager, { Keys } from "../input/inputManager";
import { Behaviour } from "./behaviour";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { IBehaviourData } from "./IBehaviourData";

export class KeyBoardMovementBehaviourData implements IBehaviourData {
    public name: string;
    public speed: number = 0.1;
    
    public setFromJson(json: any): void {
        if(json.name === undefined) {
            throw new Error("Behaviour data is missing a name.");
        }
        this.name = String(json.name);

        if(json.speed !== undefined) {
            this.speed = Number(json.speed);
        }
    }

}

export class KeyBoardMovementBehaviourBuilder implements IBehaviourBuilder {
    public get type(): string {
        return "keyboardMovement";
    }

    public buildFromJson(json: any): IBehaviour {
        let data = new KeyBoardMovementBehaviourData();
        data.setFromJson(json);
        return new KeyBoardMovementBehaviour(data);
    }

}

export class KeyBoardMovementBehaviour extends Behaviour {
   
    public speed: number = 0.1;

    constructor(data: KeyBoardMovementBehaviourData) {
        super(data);
        this.speed = data.speed;
    }

    public update(dt: number) {
        if(InputManager.IsKeyDown(Keys.LEFT)) {
            this,this.m_Owner.Transform.Position[0] -=  this.speed;
        }

        if(InputManager.IsKeyDown(Keys.RIGHT)) {
            this,this.m_Owner.Transform.Position[0] +=  this.speed;
        }

        if(InputManager.IsKeyDown(Keys.UP)) {
            this,this.m_Owner.Transform.Position[1] -=  this.speed;
        }

        if(InputManager.IsKeyDown(Keys.DOWN)) {
            this,this.m_Owner.Transform.Position[1] +=  this.speed;
        }

        super.update(dt);
    }
}