class CommandList {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
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
  getCommand(name) {
    if (this.aliases.has(name)) {
      let commandName = this.aliases.get(name)
      return commandName ? this.getCommand(commandName) : null;
    }
    if (this.commands.has(name)) {
      return this.commands.get(name);
    }
    return null;
  }
  * allNames(insertionOrder) {
    let keys = [this.aliases.keys()];
    if (!insertionOrder) {
      keys.sort();
    }
    for (let key of keys) {
      if(key && getCommand(key))
      {
        yield key;
      }
    }
  }
  * values() {
    yield* this.commands.values();
  }
  * entries() {
    let keys = [...this.commands.keys(), ...this.aliases.keys()];
    keys.sort();
    for (let key of keys) {
      yield [key, this.getCommand(key)];
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
