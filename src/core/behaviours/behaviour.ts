import SimObject from "../world/simObject";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourData } from "./IBehaviourData";

export abstract class Behaviour implements IBehaviour {
    public name: string;
    protected m_Data: IBehaviourData;
    protected m_Owner: SimObject;

    constructor(data: IBehaviourData) {
        this.m_Data = data;
        this.name = this.m_Data.name;
    }

    public setOwner(owner: SimObject): void {
        this.m_Owner = owner;
    }
    
    public update(dt: number): void {}
    public apply(userData: any): void {}

}