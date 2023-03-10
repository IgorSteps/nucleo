import { ComponentManager } from './core/components/componentManager';
import { SpriteComponentBuilder } from './core/components/spriteComponent';
import Engine from './core/engine'
import "./index.css"

var engine: Engine;
// the main entry point to the application
window.onload = function () {
    engine = new Engine();
    engine.start();
}

window.onresize = () => {
    engine.resize()
}