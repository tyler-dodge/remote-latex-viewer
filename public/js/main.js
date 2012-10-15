function baseUrl() {
  return window.location.protocol + '//' + window.location.hostname + ':' + port;
}

function loadPDF() {
  var http;
  if (window.XMLHttpRequest) http = new XMLHttpRequest();
  else http = new ActiveXObject("Microsoft.XMLHTTP");
  http.open("GET", "/error", true);
  http.send();
  http.onreadystatechange = function() {
    console.log('received status', http.status, http.responseText);
    if (http.readyState == 4 && http.status == 204) {
      renderPDF();
    } else if (http.readyState == 4) {
      showErrors(http.responseText);
    }
  };
}

function renderPDF() {
  clearPages();
  document.getElementById("error").style.display="none";
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
        document.getElementById("viewer").style.display = "block";
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
  viewer.style.width = viewer.clientwidht + "px";
  viewer.innerHTML = "";
}
function showErrors(errorString) {
  var errorsHtml = "<b>Compile Error</b><br />" + (errorString.split("\n").join('<br />'));
  document.getElementById("error").style.display="block";
  document.getElementById("errorDescription").innerHTML = errorsHtml;
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
  loadPDF();
});

socket.on('file_start_compile', function() {
  document.getElementById('loading').style.display = 'block';
});

socket.on('file_update', function() {
  document.getElementById('loading').style.display = 'none';
  loadPDF();
});


