var App     = require("./app");
var Routes  = require("./routes");
var Fn  = require("./fn");
var Controllers= require("./controllers");
var app     = new App();
var fn = new Fn(app);
var controllers = new Controllers(fn);
new Routes(controllers);