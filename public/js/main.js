function baseUrl() {
  return window.location.protocol + '//' + window.location.hostname + ':' + port;
}

function loadPDF() {
  clearPages();
  PDFJS.disableWorker = true;
  PDFJS.getDocument('/file.pdf').then(function getPDF(pdf) {
    var count = 1;
    var getPage = function(page) {
      addPage(page);
      if (count < pdf.numPages) {
        count++;
        pdf.getPage(count).then(getPage);
      } else {
        document.getElementById('viewer').style.height = "";
      }
    };
    pdf.getPage(count).then(getPage);
  });
}
function addPage(page) {
  PDFJS.disableWorker = true;
  var canvas = document.createElement("canvas");
  var scale = 1.5,
      viewport = page.getViewport(scale),
      context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  page.render({canvasContext: context, viewport: viewport});
  document.getElementById('viewer').appendChild(canvas);
}
function clearPages() {
  var viewer = document.getElementById('viewer');
  viewer.style.height = viewer.clientHeight + "px";
  viewer.innerHTML = "";
}
  
var socket = io.connect( baseUrl() );
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
  loadPDF();
  document.getElementById('loading').style.display = 'none';
});

socket.on('file_start_compile', function() {
  document.getElementById('loading').style.display = 'block';
});
