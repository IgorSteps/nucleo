import { vec2 } from "gl-matrix";
import Message from "../message/message";

export enum Keys {
    LEFT = 97, //a
    UP = 119, //w
    RIGHT = 100, //d 
    DOWN = 115 //s
}

export class MouseContext {
    public leftDown: boolean;
    public rightDown: boolean;
    public position: vec2;

    constructor(leftDown: boolean, rightDown: boolean, position: vec2) {
        this.leftDown = leftDown;
        this.rightDown = rightDown;
        this.position = position;
    }
}

export default class InputManager {
    private static m_Keys: boolean[] = [];
    private static m_MouseX: number;
    private static m_MouseY: number;
    private static m_PreviousMouseX: number;
    private static m_PreviousMouseY: number;
    private static m_LeftDown: boolean = false;
    private static m_RightDown: boolean = false;
    

    public static init(): void {
        for(let i=0; i<255; ++i) {
            InputManager.m_Keys[i] = false;
        }

        window.addEventListener("keydown", InputManager.onKeyDown);
        window.addEventListener("keyup", InputManager.onKeyUp);
        window.addEventListener("mousemove", InputManager.onMouseMove);
        window.addEventListener("mousedown", InputManager.onMouseDown);
        window.addEventListener("mouseup", InputManager.onMouseUp);

    }

    public static getMousePos(): vec2 {
        return vec2.set(vec2.create(), InputManager.m_MouseX, InputManager.m_MouseY);
    }

    public static IsKeyDown(key: Keys): boolean{
        return InputManager.m_Keys[key];
    }

    private static onKeyDown(event: KeyboardEvent): boolean {
        InputManager.m_Keys[event.key.charCodeAt(0)] = true;
        return true;
        // event.preventDefault();
        // event.stopPropagation()
        // return false;
    }

    private static onKeyUp(event: KeyboardEvent): boolean {
        InputManager.m_Keys[event.key.charCodeAt(0)] = false;
        return true;
        // event.preventDefault();
        // event.stopPropagation()
        // return false;
    }

    private static onMouseMove(event: MouseEvent):void {
        InputManager.m_PreviousMouseX = InputManager.m_MouseX;
        InputManager.m_PreviousMouseY = InputManager.m_MouseY;
        InputManager.m_MouseX = event.clientX;
        InputManager.m_MouseY = event.clientY;
    }

    private static onMouseDown(event: MouseEvent): void {
        if(event.button === 0) {
            InputManager.m_LeftDown = true;
        } else if(event.button === 2) {
            InputManager.m_RightDown = true;
        }

        Message.send("MOUSE_DOWN", this, new MouseContext(InputManager.m_LeftDown, InputManager.m_RightDown, InputManager.getMousePos()));
    }

    private static onMouseUp(event: MouseEvent): void {
        if(event.button === 0) {
            InputManager.m_LeftDown = false;
        } else if(event.button === 2) {
            InputManager.m_RightDown = false;
        }

        Message.send("MOUSE_UP", this, new MouseContext(InputManager.m_LeftDown, InputManager.m_RightDown, InputManager.getMousePos()));
    }
}