import Engine from './core/engine'
import Message from './core/message/message';
import "./index.css"

var engine: Engine;
// the main entry point to the application
window.onload = function () {
    engine = new Engine(320, 480);
    engine.start("viewport");
}

window.onresize = () => {
    engine.resize()
}