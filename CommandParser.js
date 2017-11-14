const AutoCompleter = require("./AutoCompleter.js");
const CommandOverwritten = require("./CommandOverwritten.js");

const CommandList = require("./src/CommandList.js");

const shorthandMap = new WeakMap();

function hotkeySubmit(event, text, parser) {
  event.preventDefault();
  parser.submit();
}
function hotkeyAutoComplete(event, text, parser) {
  event.preventDefault();
  parser.autocomplete(event.shiftKey);
}
hotkeyAutoComplete.noDisableAutocomplete = true;
function hotkeyClear(event, text, parser) {
  event.preventDefault();
  parser.clearText();
}

function shorthand(parser, func) {
  if (!shorthandMap.has(parser)) {
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
  loadAliases(json) {
    this.commands.loadAliases(json);
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
  /**
   * Add a command to the list of commands.
   * Optional noAlias boolean will prevent the command from being used without the rawCommand prefix (:#<command>)
   */
  addCommand(command, noAlias) {
    this.commands.addCommand(command, !noAlias);
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
    let arg_split = /(?:^:#)?(?:\w+|(["']).+?(?:\\\1.+?)*(?:(?:\\\\\1)|\1))/g;
    let args = [];
    let m;
    while ((m = arg_split.exec(this.text)) !== null) {
        args.push(m[0])
    }
    this.commands.submitCommand(...args);//TODO
    //console.log(this.text);
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
    var commands = [];
    for (let command of this.commands.valid()) {
      if (command.startsWith(this.autocompleter.text))
      {
        commands.push(command);
      }
    }
    return commands;
  }
}

module.exports = CommandParser
