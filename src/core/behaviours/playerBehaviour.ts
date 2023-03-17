import { vec2, vec3 } from "gl-matrix";
import AudioManager from "../audio/audioManager";
import { CollisionData } from "../collision/collisionManager";
import AnimatedSpriteComponent from "../components/animatedSpriteComponent";
import InputManager, { Keys } from "../input/inputManager";
import IMessageHadnler from "../message/IMessageHandler";
import Message from "../message/message";
import { Behaviour } from "./behaviour";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { IBehaviourData } from "./IBehaviourData";
import { degrees_to_radians } from "../math/utils";

export class PlayerBehaviourData implements IBehaviourData {
    public name: string;
    public acceleration: vec2 = vec2.fromValues(0, 920);
    public playerCollisionComponent: string;
    public groundCollisionComponent: string;
    public animatedSpriteName: string;
    
    public setFromJson(json: any): void {
        if(json.name === undefined) {
            throw new Error("Behaviour data is missing a name.");
        }
        this.name = String(json.name);

        if(json.acceleration !== undefined) {
            vec2.set(this.acceleration, json.acceleration.x, json.acceleration.y);
        }

        if(json.animatedSpriteName === undefined) {
            throw new Error("Behaviour data is missing a animatedSpriteName.");
        } else {
            this.animatedSpriteName = String(json.animatedSpriteName);
        }

        if(json.playerCollisionComponent === undefined) {
            throw new Error("Behaviour data is missing a playerCollisionComponent.");
        } else {
            this.playerCollisionComponent = String(json.playerCollisionComponent);
        }

        if(json.groundCollisionComponent === undefined) {
            throw new Error("Behaviour data is missing a groundCollisionComponent.");
        } else {
            this.groundCollisionComponent = String(json.groundCollisionComponent);
        }
    }

}

export class PlayerBehaviourBuilder implements IBehaviourBuilder {
    public get type(): string {
        return "player";
    }

    public buildFromJson(json: any): IBehaviour {
        let data = new PlayerBehaviourData();
        data.setFromJson(json);
        return new PlayerBehaviour(data);
    }

}

export class PlayerBehaviour extends Behaviour implements IMessageHadnler{
   private m_Acceleration: vec2;
   private m_Velocity: vec2 = vec2.create();
   private m_IsAlive: boolean = true;
   private m_PlayerCollisionComponent: string;
   private m_GroundCollisionComponent: string;
   private m_AnimatedSpriteName: string;

   private m_Sprite: AnimatedSpriteComponent;

    constructor(data: PlayerBehaviourData) {
        super(data);

        this.m_Acceleration = data.acceleration;
        this.m_GroundCollisionComponent = data.groundCollisionComponent;
        this.m_PlayerCollisionComponent = data.playerCollisionComponent;
        this.m_AnimatedSpriteName = data.animatedSpriteName;

        Message.subscribe("MOUSE_DOWN", this);
        Message.subscribe("COLLISION_ENTRY:"+this.m_PlayerCollisionComponent , this);
    }

    public updateReady(): void {
        super.updateReady();

        // Get reference to animated sprite
        this.m_Sprite= this.m_Owner.getComponentByName(this.m_AnimatedSpriteName) as AnimatedSpriteComponent;
        if(this.m_Sprite === undefined) {
            throw new Error("AnimatedSpriteComponent " + this.m_AnimatedSpriteName + " is not attached to the owqner of this component")
        }
    }

    public update(dt: number): void {
        if(!this.m_IsAlive) {
            return;
        }

        // Gravity
        let seconds: number = dt / 1000;
        let accelerationClone: vec2 = vec2.clone(this.m_Acceleration)
        let scaleVec: vec2 = vec2.scale(accelerationClone, accelerationClone, seconds);
        vec2.add(this.m_Velocity, this.m_Velocity, scaleVec);

        // Limit max speed
        if(this.m_Velocity[1] > 400) {
            this.m_Velocity[1] = 400;
        }

        //Prevent flying too high
        if(this.m_Owner.Transform.Position[1] < -13) {
            this.m_Owner.Transform.Position[1] = -13;
            this.m_Velocity[1] = 0;
        }

        // Speed
        let velocityClone: vec2 = vec2.clone(this.m_Velocity);
        scaleVec = vec2.scale(velocityClone, velocityClone, seconds);
        let convertedToVec3: vec3 = vec3.fromValues(scaleVec[0], scaleVec[1], 0);
        vec3.add(this.m_Owner.Transform.Position, this.m_Owner.Transform.Position, convertedToVec3);

        // Rotations 
        if(this.m_Velocity[1] < 0) {
            this.m_Owner.Transform.Rotation -= degrees_to_radians(600) * seconds;
            if(this.m_Owner.Transform.Rotation < degrees_to_radians(-20)) {
                this.m_Owner.Transform.Rotation = degrees_to_radians(-20);
            }
        }
        if(this.isFalling() || !this.m_IsAlive) {
            this.m_Owner.Transform.Rotation += degrees_to_radians(480) * seconds;
            if(this.m_Owner.Transform.Rotation > degrees_to_radians(90)) {
                this.m_Owner.Transform.Rotation = degrees_to_radians(90);
            }
        }

        if(this.shouldNotFlap()) {
            this.m_Sprite.stop();
        } else {
            if(!this.m_Sprite.isPlaying()) {
                this.m_Sprite.play();
            }
        }

        super.update(dt);
    }

    public onMessage(msg: Message): void {
        switch (msg.Code) {
            case "MOUSE_DOWN":
                this.onFlap();
                break;
            case "COLLISION_ENTRY:"+this.m_PlayerCollisionComponent:
                let data: CollisionData = msg.Context as CollisionData;
                if(data.a.name === this.m_GroundCollisionComponent || data.b.name === this.m_GroundCollisionComponent) {
                    this.die();
                    this.decelerate();
                    Message.send("PLAYER_DIED", this);
                }
                break;
        }

    }

    private isFalling(): boolean {
        return this.m_Velocity[1] > 220.0;
    }

    private shouldNotFlap(): boolean {
        return this.m_Velocity[1] > 220.0 || !this.m_IsAlive;
    }

    private die(): void {
        this.m_IsAlive = false;
        AudioManager.playSound("dead"); 
    }

    private decelerate(): void {
        this.m_Acceleration[1] = 0;
        this.m_Velocity[1] = 0;
    }

    private onFlap(): void {
        if(this.m_IsAlive) {
            this.m_Velocity[1] = -280.0; 
            AudioManager.playSound("flap");
        }
    }

    private onRestart(y: number): void {
        this.m_Owner.Transform.Rotation = 0;
        vec3.set(this.m_Owner.Transform.Position, 33, y, 1);
        vec2.set(this.m_Velocity, 0,0);
        vec2.set(this.m_Acceleration, 0,920);
        this.m_IsAlive = true;
        this.m_Sprite.play();
    }
}