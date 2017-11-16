//TODO: extends Command? const Command = require("./Command.js");

class CommandAlias/* extends Command*/
{
  constructor(commandList, aliasJson)
  {
    this.list = commandList;
    this.commandKey = aliasJson.action || aliasJson.command;
    this.commandArgs = aliasJson.args;//TODO:?
  }
  parseArgs(commandLine)
  {//TODO: test and fix (how does aliased command parse the syntax?)
    let command = this.list.__getCommand(this.commandKey);
    return Object.assign(command.parseArgs(commandLine), this.commandArgs);
  }
  submit(args)
  {
    this.list.__getCommand(this.commandKey).submit(args);
  }
}

module.exports = CommandAlias;
