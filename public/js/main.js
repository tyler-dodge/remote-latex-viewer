var self = this;
var socket = io.connect(
    window.location.protocol + '//' + window.location.hostname + ':' + port
    );
var reconnect_interval = 5000;

function reconnect() {
  socket.socket.connect();
}
function loadDocument() {
  $.ajax(window.location.protocol + '//' + window.location.hostname + ':' + port + "/file.pdf")
   .done(function(data) {
      $('#viewer').text(data);
  });
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
  $('#viewer').text("FILE UPDATED");
  loadDocument();
});

