var io = require('socket.io');
var fs = require('fs');
var exec = require('child_process').exec;
module.exports = function texSocket(app) {
  io = io.listen(app, {'log level': 0});
  var sockets = [];
  this.notifyStartCompile = function notifyStartCompile() {
    sockets.forEach(function(socket) {
      socket.emit("file_start_compile");
    });
  };
  this.notifyUpdate = function notifyUpdate() {
    sockets.forEach(function(socket) {
      socket.emit("file_update");
    });
  };
};
