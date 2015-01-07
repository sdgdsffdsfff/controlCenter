var App     = require("./app");
var Routes  = require("./routes");
var Fn  = require("./fn");
var Middleware= require("./middleware");
var app     = new App();
var fn = new Fn(app);
var middleware = new Middleware(fn);
new Routes(middleware);