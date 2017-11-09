/**Pattern used to match for raw, un-aliased command ids*/
const RAW_COMMAND_EXP = "^:#(.+)$";

const {sprintf} = require("sprintf-js");

class CommandList {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
    this.aliasArgs = new Map();
  }
  loadAliases(json) {
    for(let alias in json) {
      let commandJson = json[alias];
      this.addAlias(alias, commandJson);
    }
  }
  addAlias(alias, commandJson) {
    if(typeof commandJson === "string")
    {
      this.aliases.set(alias, commandJson);
    }
    else {
      this.aliases.set(alias, commandJson.action);
      this.aliasArgs.set(alias, commandJson.args);
    }
  }
  addCommand(command) {
    var name = command.name;
    if (this.commands.has(name)) {
      let existingCmd = this.commands.get(name);
      console.warn("Command %O already registered while trying to add Command %O with name %s.", existingCmd, command, name);
    }
    this.commands.set(name, command);
  }
  removeCommand(name) {
    if (this.commands.has(name)) {
      this.commands.delete(name);
    }
  }
  hasCommand(name) {
    let rawCommandName = name.match(RAW_COMMAND_EXP);
    if (rawCommandName) {
      let rawName = rawCommandName[1];
      return this.commands.has(rawName);
    }
    if (this.aliases.has(name)) {
      let commandName = this.aliases.get(name);
      return commandName && (this.commands.has(commandName) || this.hasCommand(commandName));
    }
    return false;
  }
  submitCommand(name, ...commandArgs) {
    let rawCommandName = name.match(RAW_COMMAND_EXP);
    if (rawCommandName) {
      let rawName = rawCommandName[1];
      if(this.commands.has(rawName)) {
        let command = this.commands.get(rawName);
        command.submit(...commandArgs);
      }
    } else if (this.aliases.has(name)) {
      let commandName = this.aliases.get(name);
      /*TODO: sub-aliases:
      if(this.aliases.has(commandName))
      {
        if(this.aliasArgs.has(commandName))
        {
          //TODO: fill args:
          //commandArgs = sprintf(this.aliasArgs.get(commandName), ...commandArgs);
        }

        return this.__getCommand(commandName);
        let command = this.commands.get(commandName);

      }*/
      if(commandName && this.commands.has(commandName))
      {
        //TODO: fill args:
        //commandArgs = sprintf(this.aliasArgs.get(commandName), ...commandArgs);
        let command = this.commands.get(rawName);
        command.submit(...commandArgs);
      }
    }
  }
  * allNames(insertionOrder) {
    let keys = [this.aliases.keys()];
    if (!insertionOrder) {
      keys.sort();
    }
    for (let key of keys) {
      if(key && this.hasCommand(key))
      {
        yield key;
      }
    }
  }
  * validCommands() {
    let vals = [...this.commands.keys()];
    for (let [alias, aliasArr] of this.aliases) {
      if (aliasArr.length == 1) {
        vals.push(alias);
      }
    }
    vals.sort();
    yield* vals;
  }
  *[Symbol.iterator]() {
    yield* this.validCommands();
  }
}


module.exports = CommandList;
