var exec = require('child_process').exec;
module.exports = function ip(callback) {
  exec('ifconfig | grep inet | grep netmask | grep -v 127.0.0.1', function(err,stdout,stderr) {
    stdout = stdout.substr(0,stdout.indexOf('netmask'));
    stdout = stdout.substr(stdout.indexOf('inet') + 5);
    stdout = stdout.replace(' ', '');
    callback(err, stdout);
  });
};
