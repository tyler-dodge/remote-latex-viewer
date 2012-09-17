var fs = require('fs');
var exec = require('child_process').exec;
module.exports = function(app, texSocket, settings) {
  function compileTex(file, destination, callback) {
    exec("pdflatex -halt-on-error -file-line-error " + file + " -o " + destination + " | grep '" + settings.file + ":'" ,  function(err,stdout,stderr) {
      //grep does not return an error if it finds the data
      if (err === null || err === undefined) {
        console.log(stdout);
        console.log("Update Failed");
      } else {
        console.log(destination);
        console.log("Update Successful");
        callback();
      }
    });
  }

  console.log(settings.file);
  fs.watch(settings.file,function() {
    texSocket.notifyStartCompile();
    compileTex(settings.file,settings.destination, texSocket.notifyUpdate);
  });
  app.get('/', function(req, res) {
    res.render('index.jade', {
      pageTitle:"Remote LaTeX Viewer: " + settings.file,
      port:settings.port
    });
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
        console.log("COMPILE");
        texSocket.notifyStartCompile();
        compileTex(settings.file,settings.destination,function() {
          writeRes();
          texSocket.notifyUpdate();
        });
      }
    });
  });
};
