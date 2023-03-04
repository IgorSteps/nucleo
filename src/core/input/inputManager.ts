export enum Keys {
    LEFT = 97, //a
    UP = 119, //w
    RIGHT = 100, //d 
    DOWN = 115 //s
}

export default class InputManager {
    private static m_Keys: boolean[] = [];
    

    public static init(): void {
        for(let i=0; i<255; ++i) {
            InputManager.m_Keys[i] = false;
        }

        window.addEventListener("keydown", InputManager.onKeyDown);
        window.addEventListener("keyup", InputManager.onKeyUp);

    }

    public static IsKeyDown(key: Keys): boolean{
        return InputManager.m_Keys[key];
    }

    private static onKeyDown(event: KeyboardEvent): boolean {
        InputManager.m_Keys[event.key.charCodeAt(0)] = true;
        event.preventDefault();
        event.stopPropagation()
        return false;
    }

    private static onKeyUp(event: KeyboardEvent): boolean {
        InputManager.m_Keys[event.key.charCodeAt(0)] = false;
        event.preventDefault();
        event.stopPropagation()
        return false;
    }


}