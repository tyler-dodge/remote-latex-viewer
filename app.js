#!/usr/local/bin/node
var args = process.argv;
var settings = new (require('./settings'))(args);

var express = require("express");
var exec = require('child_process').exec;
var ip = require('./ip');
var app = express();  
var TexSocket = require('./TexSocket');
var Route = require('./routes');

if (settings.shouldStop()) {
  if (settings.showHelp) {
    console.log(
        "Usage: rlv <watched tex file> <port>\n" +
        "where port defaults to 3000\n"
    );
  }
  settings.errors.forEach(function(error) {
    console.log(error + "\n");
  });
  return;
}

/**
 * Configure
 */
app.configure(function() {
  app.use(app.router);
});
app.configure("development", function() {
  app.use(express["static"](__dirname + "/public"));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure("production", function() {
  var oneYear = 31557600000;
  app.use(express["static"](__dirname + "/public", {
    maxAge: oneYear
  }));
  app.use(express.errorHandler());
});

ip(function(err,server) {
  console.log("Serving at " + server + ":" + settings.port);
  console.log("Watching " + settings.file + "...");
});
var server = app.listen(settings.port);
var sockets = new TexSocket(server);
Route(app,sockets,settings);
