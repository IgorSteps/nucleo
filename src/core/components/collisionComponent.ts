import { vec2, vec3 } from "gl-matrix";
import { CollisionManager } from "../collision/collisionManager";
import Circle from "../graphics/shapes/circle";
import IShape from "../graphics/shapes/IShape";
import Rectangle from "../graphics/shapes/rectangle";
import Component from "./component";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class CollisionComponentData implements IComponentData{
    public name: string;
    public shape: IShape;
    public static: boolean = true;

    public setFromJson(json: any): void {
        if(json.name !== undefined) {
            this.name = String(json.name);
        }
        if(json.static !== undefined) {
            this.static = Boolean(json.static);
        }

        if(json.shape === undefined) {
            throw new Error("Shape is missing in collision component")
        } else {
            if(json.shape.type === undefined) {
                throw new Error("Type is missing in collision component")
            }
        }

        let type = String(json.shape.type).toLowerCase();
        switch(type){
            case "rectangle":
                this.shape = new Rectangle();
                break;
            case "circle":
                this.shape = new Circle();
                break;
            default:
                throw new Error("Unsupported shape type: " + type);
        }

        this.shape.setFromJson(json.shape);
    }
}

export class CollisionComponentBuilder implements IComponentBuilder {
    public get type(): string {
        return "collision"
    }

    public buildFromJson(json: any): IComponent {
        let data = new CollisionComponentData();
        data.setFromJson(json);
        return new CollisionComponent(data);
    }

}

export default class CollisionComponent extends Component {

    private m_Shape: IShape;
    private m_Static: boolean;

    constructor(data: CollisionComponentData) {
        super(data);
        this.m_Shape = data.shape;
        this.m_Static = data.static;
    }

    public get isStatic (): boolean {
        return this.m_Static;
    }

    public load(): void {
        super.load();
        // @TODO: problem with getting world position for nested objects
        vec2.set(this.m_Shape.position, this.m_Owner.getWorldPosition()[0], this.m_Owner.getWorldPosition()[1]);
        // @TODO: hacky way to fix problem with collisions and origins - remove
        vec2.subtract(this.m_Shape.position, this.m_Shape.position, this.m_Shape.offset);

        CollisionManager.registerCollisionComponent(this);
    }

    public update(dt: number): void {
        // @TODO: problem with getting world position for nested objects
        vec2.set(this.m_Shape.position, this.m_Owner.getWorldPosition()[0], this.m_Owner.getWorldPosition()[1]);
        // @TODO: hacky way to fix problem with collisions and origins - remove
        vec2.subtract(this.m_Shape.position, this.m_Shape.position, this.m_Shape.offset);

        super.update(dt);
    }

    public get shape(): IShape {
        return this.m_Shape;
    }

    public onCollisionEntry(other: CollisionComponent) {
        //console.log("onCollisionEntry", this, other)

    }

    public onCollisionUpdate(other: CollisionComponent) {
        //console.log("onCollisionUpdate", this, other)

    }

    public onCollisionExit(other: CollisionComponent) {
       // console.log("onCollisionExit", this, other)

    }

   

}
