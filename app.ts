var engine: TSE.Engine;

// the main entry point to the application
window.onload = function () {
    engine = new TSE.Engine();
    engine.start();
}

window.onresize = () => {
    engine.resize()
}