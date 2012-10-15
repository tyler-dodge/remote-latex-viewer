var fs = require('fs');
var exec = require('child_process').exec;
module.exports = function(app, texSocket, settings) {
  var lastError = "";
  var lastIsSuccess = true;

  //Delete pdf at start
  fs.unlink(settings.destination);

  function compileTex(file, destination, callback) {
    var lastSlash = file.lastIndexOf("/") + 1;
    var path = file.substr(0, lastSlash);
    var fileName = file.substr(lastSlash, file.length);
    console.log(fileName + " modified! Compiling...");
    exec("pdflatex -halt-on-error -file-line-error -output-directory " + settings.destinationDir + " " + file +
      " | grep -A 1 '" + settings.file + ":'" + //-A 1 to get 2 line errors
      " | head -n 2" + //Only get the first error
      " | tr -d '\n' " + //join linebreaks into one
      " | sed -e 's/[\.!][^\.!]*$/./'" + //kill everything after last sentence
      " | replace '"+path+"' ''", //get rid of path so just filename
    function(err,stdout,stderr) {
      if (stdout.indexOf(fileName) > -1) {
        lastError = stdout;
        lastIsSuccess = false;
        console.log("--> Update Failed! "+stdout);
        callback(stdout);
      } else {
        lastIsSuccess = true;
        console.log("--> Update Successful! Wrote " + destination.substr(destination.lastIndexOf("/")+1, destination.length) + ".");
        callback();
      }
    });
  }

  fs.watchFile(settings.file, 
      { persistent: true, interval: 500}, 
      function() {
      texSocket.notifyStartCompile();
      compileTex(settings.file,settings.destination, texSocket.notifyUpdate);
  });
  app.get('/', function(req, res) {
    res.render('index.jade', {
      pageTitle:"Remote LaTeX Viewer: " + settings.file,
      port:settings.port
    });
  });

  app.get('/error', function(req, res) {
    if (lastIsSuccess) {
      res.send(204);
    } else {
      res.send(lastError, 200);
    }
  });

  app.get('/file.pdf', function(req, res) {
    fs.exists(settings.destination, function(exists) {
      var writeRes = function() {
        fs.readFile(settings.destination, function(err, data) {
          if (err === undefined || err === null) {
            res.write(data);
          } else {
            console.log(err);
          }
          res.end();
        });
      };
      if (exists) {
        writeRes();
      } else {
        texSocket.notifyStartCompile();
        compileTex(settings.file,settings.destination,function(error) {
          if (error === null || error === undefined) {
            writeRes();
            texSocket.notifyUpdate();
          } else {
            res.end();
            texSocket.notifyUpdate();
          }
        });
      }
    });
  });
};
