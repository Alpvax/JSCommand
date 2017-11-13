const CommandSyntax = require("../CommandSyntax.js");

class Command {
  constructor(name) {
    this.name = name;
  }
  addSyntax(syntax) {
    this.syntax.push(new CommandSyntax(syntax));
  }
  parseArgs(commandLine) {
    return {
      "args": commandLine
    };
  }
  submit(args) {
    console.error("Command %s registered with no \"submit\" method.%nArgs: %O", this.name, args);
  }
}

module.exports = Command;
