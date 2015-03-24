var App     = require("./app");
var Routes  = require("./routes");
var Fn  = require("./fn");
var Base= require("./base");
var app     = new App();
var fn = new Fn(app);
var base = new Base(fn);
new Routes(base);