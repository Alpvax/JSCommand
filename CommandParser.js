const AutoCompleter = require("./AutoCompleter.js");
const CommandOverwritten = require("./CommandOverwritten.js");

class CommandList {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
  }
  addCommand(command) {
    var name = command.name;
    if (this.commands.has(name)) {
      let existingCmd = this.commands.get(name);
      console.warn("Command %O already registered while trying to add Command %O with name %s.", existingCmd, command, name);
      /*var overridden = new CommandOverwritten(existingCmd);
      for(let alias of existingCmd.aliases)
      {
          this.aliases.set(alias, overridden);
      }*/
    }
    this.commands.set(name, command);
    for (let alias of command.aliases) {
      if (this.aliases.has(alias)) {
        this.aliases.get(alias).push(name);
      } else {
        this.aliases.set(alias, [name]);
      }
    }
  }
  removeCommand(name) {
    if (this.commands.has(name)) {
      for (let alias of this.commands.get(name).aliases) {
        let arr = this.aliases.get(alias).filter(a => a != name);
        if (arr.length < 1) {
          this.aliases.delete(alias);
        } else {
          this.aliases.set(alias, arr);
        }
      }
      this.commands.delete(name);
    }
  }
  getCommand(name) {
      if (this.commands.has(name)) {
        return this.commands.get(name);
      }
      if (this.aliases.has(name)) {
        let aliasArr = this.aliases.get(name);
        if (aliasArr.length == 1) {
          return getCommand(aliasArr[0]);
        }
        //return alias instanceof Command ? alias : this.getCommand(alias);
      }
      return null;
    }
    * keys() {
      let keys = [...this.commands.keys(), ...this.aliases.keys()];
      keys.sort();
      for (let key of keys) {
        yield key;
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

const shorthandMap = new WeakMap();

function hotkeySubmit(event, text, parser){
  event.preventDefault();
  parser.submit();
}
function hotkeyAutoComplete(event, text, parser){
  event.preventDefault();
  parser.autocomplete(event.shiftKey);
}
hotkeyAutoComplete.noDisableAutocomplete = true;
function hotkeyClear(event, text, parser){
  event.preventDefault();
  parser.clearText();
}

function shorthand (parser, func) {
  if(!shorthandMap.has(parser))
  {
    shorthandMap.set(parser, new Map([
      [parser.submit, hotkeySubmit],
      [parser.autocomplete, hotkeyAutoComplete],
      [parser.clearText, hotkeyClear]
    ]));
  }
  let map = shorthandMap.get(parser);
  return map.has(func) ? map.get(func) : func;
}

class CommandParser {
  constructor(inputText) {
    this.inputText = inputText;
    this.active = true;
    this.hotkeys = {};
    this.autocompleter = new AutoCompleter(this);
    this.addHotkey("Enter", this.submit);
    this.addHotkey("Escape", this.clearText);
    this.addHotkey("Tab", this.autocomplete);
    this.inputText.addEventListener("keydown", this.__handleKeyDown.bind(this));
    this.commands = new CommandList();
  }
  activate() {
    this.active = true;
    return this;
  }
  deactivate() {
    this.active = false;
    return this;
  }
  get text() {
    return this.inputText.value
  }
  set text(value) {
    this.inputText.value = value
  }
  addHotkey(key, callback) {
    if (key in this.hotkeys) {
      console.log("Replacing keybind \"%s\": %O with: %O", key, this.hotkeys[key], callback);
    }
    this.hotkeys[key] = shorthand(this, callback);
    return this; //For chaining
  }
  addCommand(command) {
    this.commands.addCommand(command);
    return this; //For chaining
  }
  /**
   * Use this to clear all text from the entry.
   * Optional argument is keyEvent (for convenience with addHotkey). If passed in, event.preventDefault() will be called.
   */
  clearText(parser) {
    this.text = "";
  }
  /**
   * Use this to autocomplete the entry.
   * Optional argument is boolean to reverse direction.
   */
  autocomplete(reverse) {
    this.autocompleter.fillNext(reverse);
  }
  submit() {
    console.log(this.text);
    let handled = true; //TODO
    if (handled) {
      this.clearText();
    }
    return handled;
  }
  get usage() {
    //TODO: Usage
  }
  __handleKeyDown(e) {
    if (!this.active) {
      return;
    }
    if (e.key in this.hotkeys) {
      let callback = this.hotkeys[e.key];
      if (!callback.noDisableAutocomplete) {
        this.autocompleter.disable();
      }
      var result = callback(e, this.text, this);
    }
  }
  __getAutoCompletionOptions() {
    return Array.from(this.commands.validCommands());
  }
}

module.exports = CommandParser
