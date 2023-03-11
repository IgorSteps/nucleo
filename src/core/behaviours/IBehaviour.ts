import SimObject from "../world/simObject";

export interface IBehaviour {
    name: string;
    setOwner(owner: SimObject): void;
    updateReady(): void;
    update(dt: number): void;
    apply(userData: any): void;
}