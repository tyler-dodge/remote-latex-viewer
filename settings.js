
module.exports = function Settings(args) {
  this.file = args[2];
  this.port = args[3];
  this.destination = this.file;
  this.showHelp = false;
  this.errors = {};
  if (this.file === null || this.file === undefined) {
    this.showHelp = true;
  } else {
    this.destination = this.file.replace('.tex','.pdf');
    this.errors.push(this.destination + " must have extension .tex");
  }
  if (this.port === null || this.port === undefined) {
    this.port = 3000;
  } else if (typeof this.port !== 'number') {
    this.errors.push(this.port + " is not a valid number");
  }
  this.shouldContinue = function() {
    return this.errors.length > 0 || this.showHelp;
};
