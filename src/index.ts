import Engine from './core/engine'
import "./index.css"

var engine: Engine;
// the main entry point to the application
window.onload = function () {
    engine = new Engine(320, 480);
    engine.start();
}

window.onresize = () => {
    engine.resize()
}