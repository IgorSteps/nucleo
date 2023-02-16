var engine: Nucleo.Engine;

// the main entry point to the application
window.onload = function () {
    engine = new Nucleo.Engine();
    engine.start();
}

window.onresize = () => {
    engine.resize()
}