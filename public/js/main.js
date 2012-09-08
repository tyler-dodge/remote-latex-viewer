var self = this;
var socket = io.connect(
    window.location.protocol + '//' + window.location.hostname + ':' + port
    );
var reconnect_interval = 5000;

function reconnect() {
  socket.socket.connect();
}
function loadDocument() {
}

socket.on('error', function(err) {
  setTimeout(reconnect, reconnect_interval);
});

socket.on('disconnect', function(err) {
  setTimeout(reconnect, reconnect_interval);
});

socket.on('connect', function() {
  loadDocument();
});
socket.on('file_update', function() {
  var address = window.location.protocol + '//';
  address += window.location.hostname + ':' + port + "/file.pdf";
  $('#viewer').html("<embed src='file.pdf' width='100%' height='100%'></embed>");
  
});

