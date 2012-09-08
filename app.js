#!/usr/local/bin/node
var args = process.argv;
var settings = {};
var fs = require('fs');
settings.file = args[2];
settings.port = args[3];
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
  app.set('view options', { layout: false })
  app.use(express.session({
    secret: "hugc;yfaeokxqwv';",
    key: 'express.session',
    store: app.set('sessionStore')
  }));
  app.use(express.bodyParser());
  app.use(app.router);
});
app.configure("development", function() {
  app.use(express.static(__dirname + "/public"));
  app.set('view options', { layout: false })
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
io = io.listen(app);
io.sockets.on('connection', function(socket) {
  fs.watchFile(settings.file,function(curr, prev) {
    socket.emit("file_update", settings.file);
  });
});
app.get('/', function(req, res) {
  res.pageTitle="Hello";
  console.log(res);
  res.render('index.jade', {
    locals: {
      pageTitle:"Remote LaTeX Viewer: " + settings.file,
      port:settings.port
    }
  });
});
app.get('/file.pdf', function(req, res) {
  fs.readFile(settings.file, function(err, data) {
    if (err === undefined || err === null) {
      res.write(data);
    } else {
      console.log(err);
      res.write(err);
    }
    res.end();
  });
});