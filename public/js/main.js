function baseUrl() {
  return window.location.protocol + '//' + window.location.hostname + ':' + port;
}

var socket = io.connect( baseUrl() );
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
});

socket.on('file_update', function() {
  document.getElementById('viewer').innerHTML = "<embed src='file.pdf' width='100%' height='100%'></embed>";
  document.getElementById('loading').style.display = 'none';
});

socket.on('file_start_compile', function() {
  document.getElementById('loading').style.display = 'block';
});
