var self = this;
var socket = io.connect(
    window.location.protocol + '//' + window.location.hostname + ':' + IO_PORT
    );
var reconnect_interval = 5000;

function reconnect() {
  socket.socket.connect();
}

socket.on('error', function(err) {
  setTimeout(reconnect, reconnect_interval);
});

socket.on('disconnect', function(err) {
  setTimeout(reconnect, reconnect_interval);
});

socket.on('connect', function() {
})

