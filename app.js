#!node
var args = { '0': 'rlv', '1': 'file.tex', '2': '3000' };
var settings = {};
settings.file = args[1];
settings.port = args[2];
if (settings.file === null || settings.file === undefined) {
  console.log("Help");
  return;
}

if (settings.port === null || settings.port === undefined) {
  settings.port = 3000;
}

var express = require("express");
var io = require('socket.io');

var app = this.app = express.createServer();  

/**
 * Configure
 */
app.configure(function() {
  app.set('sessionStore', new express.session.MemoryStore());

  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "hugc;yfaeokxqwv';",
    key: 'express.session',
    store: app.set('sessionStore')
  }));
  app.use(express.bodyParser());
  app.use(app.router);
});
app.set("view engine", "ejs");
app.configure("development", function() {
  app.use(express.static(__dirname + "/public"));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure("production", function() {
  var oneYear = 31557600000;
  app.use(express.static(__dirname + "/public", {
    maxAge: oneYear
  }));
  app.use(express.errorHandler());
});

app.listen(settings.port);
