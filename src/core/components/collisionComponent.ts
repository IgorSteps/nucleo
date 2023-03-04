import { vec3 } from "gl-matrix";
import Shader from "../gl/shader";
import Circle from "../graphics/shapes/circle";
import IShape from "../graphics/shapes/IShape";
import Rectangle from "../graphics/shapes/rectangle";
import Sprite from "../graphics/sprite";
import Component from "./component";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class CollisionComponentData implements IComponentData{
    public name: string;
    public shape: IShape;

    public setFromJson(json: any): void {
        if(json.name !== undefined) {
            this.name = String(json.name);
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

    constructor(data: CollisionComponentData) {
        super(data);
        this.m_Shape = data.shape;
    }
    public get shape(): IShape {
        return this.m_Shape;
    }

}
