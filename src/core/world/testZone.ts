// import SpriteComponent from "../components/spriteComponent";
// import Shader from "../gl/shader";
// import Sprite from "../graphics/sprite";
// import Level from "./level";
// import SimObject from "./simObject";

// export class TestLevel extends Level {
//     private parentObj: SimObject;
//     private m_TestObj: SimObject;
//     private m_TestSprite: SpriteComponent;
//     private parentSprite: SpriteComponent;

//     public load(): void {
//         console.log("Test level loaded")

//         this.parentObj = new SimObject(0, 'parent obj');
//         this.parentObj.Transform.Position[0] = 300;
//         this.parentObj.Transform.Position[1] = 300;
//         this.parentSprite = new SpriteComponent('test component', 'crate');

        
//         this.m_TestObj = new SimObject(1, 'test obj')
//         this.m_TestSprite = new SpriteComponent('test component', 'crate');
//         this.m_TestObj.addComponent(this.m_TestSprite);

//         this.m_TestObj.Transform.Position[0] = 120;
//         this.m_TestObj.Transform.Position[1] = 120;


//         this.parentObj.addChild(this.m_TestObj)

//         this.scene.addObject(this.parentObj);

//         super.load()

//     }

//     public update(dt: number) {

//         this.parentObj.Transform.Rotation += 0.01

//         super.update(dt);
//     }
// }