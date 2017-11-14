/**Pattern used to match for raw, un-aliased command ids*/
const RAW_COMMAND_EXP = /^:#(.+)$/;

//TODO: const {sprintf} = require("sprintf-js");
const CommandAlias = require("./CommandAlias.js");

class CommandList {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
  }
  loadAliases(json) {
    for (let alias in json) {
      let commandJson = json[alias];
      this.addAlias(alias, commandJson);
    }
  }
  addAlias(alias, commandJson) {
    if (typeof commandJson === "string") {
      this.aliases.set(alias, commandJson);
    } else if(!commandJson && this.aliases.has(alias)) {
      //Delete alias if new alias is null/undefined/empty...
      this.aliases.delete(alias);
    } else {
      this.aliases.set(alias, new CommandAlias(this, commandJson));
    }
  }
  /**
   * Optional addAlias boolean will allow using the command key without matching RAW_COMMAND_EXP
   */
  addCommand(command, addAlias) {
    var name = command.name;
    if (this.commands.has(name)) {
      let existingCmd = this.commands.get(name);
      console.warn("Command %O already registered while trying to add Command %O with name %s.", existingCmd, command, name);
    }
    this.commands.set(name, command);
    if(addAlias && !this.aliases.has(name))
    {
      this.addAlias(name, name);
    }
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
      if (typeof commandName !== "string") {
        commandName = commandName.commandKey;
      }
      return commandName && ((commandName != name && this.aliases.has(commandName) && this.hasCommand(commandName)) || this.commands.has(commandName));
    }
    return false;
  }
  __getCommand(name) {
    let rawCommandName = name.match(RAW_COMMAND_EXP);
    if (rawCommandName) {
      let rawName = rawCommandName[1];
      if (this.commands.has(rawName)) {
        return this.commands.get(rawName);
      }
    } else if (this.aliases.has(name)) {
      let alias = this.aliases.get(name);
      if (typeof alias === "string") {
        return alias != name && this.aliases.has(alias) ? this.__getCommand(alias) : (this.commands.has(alias) ? this.commands.get(alias) : null);
      } else {
        return alias;
      }
    } else {
      return null;
    }
  }
  submitCommand(name, ...commandArgs) {
    let command = this.__getCommand(name);
    if(command) {
      let args = command.parseArgs(...commandArgs);
      command.submit(args);
    } else {
      //TODO: Command not found
      console.warn("Command not found: %s", name);
    }

    /*  let rawCommandName = name.match(RAW_COMMAND_EXP);
      if (rawCommandName) {
        let rawName = rawCommandName[1];
        if (this.commands.has(rawName)) {
          let command = this.commands.get(rawName);
          command.submit(...commandArgs);
        }
      } else if (this.aliases.has(name)) {
        let alias = this.aliases.get(name);
        if (typeof alias === "string") {

        }
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
        }
        if (commandName && this.commands.has(commandName)) {
          //TODO: fill args:
          //commandArgs = sprintf(this.aliasArgs.get(commandName), ...commandArgs);
          let command = this.commands.get(commandName);
          command.submit(...commandArgs);
        }
  }*/
  }
  * valid(insertionOrder) {
    let keys = Array.from(this.aliases.keys());
    if (!insertionOrder) {
      keys.sort();
    }
    for (let key of keys) {
      if (key && this.hasCommand(key)) {
        yield key;
      }
    }
  }
  *[Symbol.iterator]() {
    yield* this.valid();
  }
}


module.exports = CommandList;
