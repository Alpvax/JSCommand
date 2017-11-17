const AutoCompleter = require("./AutoCompleter.js");

const CommandList = require("./CommandList.js");

const shorthandMap = new WeakMap();

function hotkeySubmit(event, text, parser)
{
  event.preventDefault();
  parser.submit();
}

function hotkeyAutoComplete(event, text, parser)
{
  event.preventDefault();
  parser.autocomplete(event.shiftKey);
}
hotkeyAutoComplete.noDisableAutocomplete = true;

function hotkeyClear(event, text, parser)
{
  event.preventDefault();
  parser.clearText();
}

function shorthand(parser, func)
{
  if (!shorthandMap.has(parser))
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

class CommandParser
{
  constructor(inputText)
  {
    this.inputText = inputText;
    this.active = true;
    this.commands = new CommandList();
    this.hotkeys = new Map();
    this.autocompleter = new AutoCompleter(this.__getAutoCompletionOptions);
    /*TODO:
    this.addHotkey("Enter", this.submit);
    this.addHotkey("Escape", this.clearText);
    this.addHotkey("Tab", this.autocomplete);*/
    this.addHotkey("Enter", "parser.submit");
    this.addHotkey("Escape", "parser.clearText");
    this.addHotkey("Tab", "parser.autocomplete");
    this.inputText.addEventListener("keydown", this.__handleKeyDown.bind(this));
  }
  activate()
  {
    this.active = true;
    return this;
  }
  loadAliases(json)
  {
    this.commands.loadAliases(json);
    return this;
  }
  loadHotkeys(json)
  {
    for (let key in json)
    {
      let commandJson = json[key];
      this.addHotkey(key, commandJson);
    }
    return this;
  }
  deactivate()
  {
    this.active = false;
    return this;
  }
  get text()
  {
    return this.inputText.value;
  }
  set text(value)
  {
    this.inputText.value = value;
  }
  addHotkey(key, command)
  {
    //TODO:Modifiers
    /*let modifiers = {
      "shift": /s(hift)?/i.test(key),
      "ctrl": /c(trl|ontrol)?/i.test(key),
      "alt": /a(lt)?/i.test(key),
      "meta": /m(eta)?|cmd|command/i.test(key)
    };
    key = /s(hift)?/i.test(key) ? "s" : "" +
          /c(trl|ontrol)?/i.test(key) ? "c" : "" +
          /a(lt)?/i.test(key) ? "a" : "" +
          /m(eta)?|cmd|command/i.test(key) ? "m" : "" +
          key;
    */
    if (this.hotkeys.has(key))
    {
      if (!command)
      {
        console.log("Removing keybind \"%s\": %O", key, this.hotkeys.get(key));
        return this;
      }
      console.log("Replacing keybind \"%s\": %O with: %O", key, this.hotkeys.get(key), command);
    }
    /*if(typeof command == "string") {
      ///^autocomplete(?::(?:(s(?:hift)?)|(c(?:trl|ontrol)?)|(a(?:lt)?)|(m(?:eta)?|co?m(?:man)?d)))?$/i
      let match = command.match(/^autocomplete(?::(?:(s(?:hift)?)|(c(?:trl|ontrol)?)|(a(?:lt)?)|(m(?:eta)?|co?m(?:man)?d)))?$/);
      console.debug("Shift: %s, Control: %s, Alt: %s, Command (Meta): %s", Boolean(match[1]), Boolean(match[2]), Boolean(match[3]), Boolean(match[4]));
    }*/
    let commandName = typeof command == "string" ? command : command.action;
    if (/^parser.(.+)/i.test(commandName))
    {
      this.hotkeys.set(key, command);
    }
    else
    {
      let alias = "HOTKEY_" + key;
      this.commands.addAlias(alias, command);
      this.hotkeys.set(key, alias);
    }
    return this;
  }
  addHotkeyCallback(key, callback)
  {
    if (this.hotkeys.has(key))
    {
      console.log("Replacing keybind \"%s\": %O with: %O", key, this.hotkeys.get(key), callback);
    }
    this.hotkeys.set(key, shorthand(this, callback));
    return this; //For chaining
  }
  /**
   * Add a command to the list of commands.
   * Optional noAlias boolean will prevent the command from being used without the rawCommand prefix (:#<command>)
   */
  addCommand(command, noAlias)
  {
    this.commands.addCommand(command, !noAlias);
    return this; //For chaining
  }
  /**
   * Use this to clear all text from the entry.
   * Optional argument is keyEvent (for convenience with addHotkey). If passed in, event.preventDefault() will be called.
   */
  clearText(parser)
  {
    this.text = "";
  }
  /**
   * Use this to autocomplete the entry.
   * Optional argument is boolean to reverse direction.
   */
  autocomplete(reverse)
  {
    this.text = this.autocompleter.fillNext(reverse);//TODO: partial autocompletion
  }
  submit()
  {
    this.commands.submitCommand(...this.__textToArgs()); //TODO:?
    //console.log(this.text);
    let handled = true; //TODO
    if (handled)
    {
      this.clearText();
    }
    return handled;
  }
  get usage()
  {
    //TODO: Usage
  }
  __textToArgs()
  { //TODO
    let arg_split = /(?:^:#)?(?:[^\s]+|(?:\s+|^)(["']).+?(?:\\\1.+?)*(?:(?:\\\\\1)|\1))/g;
    let args = [];
    let m;
    while ((m = arg_split.exec(this.text)) !== null)
    {
      args.push(m[0]);
    }
    return args;
  }
  __handleKeyDown(e)
  {
    if (!this.active)
    {
      return;
    }
    var disableAutoCompleter = !["Shift", "Control", "Alt", "Meta"].includes(e.key);
    if (this.hotkeys.has(e.key))
    {
      let command = this.hotkeys.get(e.key);
      let match = command.match(/^parser\.(.+)/i);
      if (match)
      {
        let parserCmd = match[1];
        let autocomp = parserCmd.match(/^autocomplete([.\-:]r(?:everse)?)?/i);
        if (autocomp)
        {
          this.autocomplete(Boolean(autocomp[1]) || e.shiftKey); //TODO: disable hard-coded shiftkey
          disableAutoCompleter = false;
        }
        else if (/^submit/i.test(parserCmd))
        {
          this.submit();
        }
        else if (/^clear/i.test(parserCmd))
        {
          this.clearText();
        }
      }
      else
      {
        this.commands.submitCommand(command, this.__textToArgs());
      }
      e.preventDefault(); //TODO:Optional?
      /*if (typeof command === "string") {
        return alias != name && this.aliases.has(alias) ? this.__getCommand(alias) : (this.commands.has(alias) ? this.commands.get(alias) : null);
      } else {
        return alias;
      }
      /*let callback = this.hotkeys.get(e.key);
      console.debug("%O", callback);
      if (!callback.noDisableAutocomplete) {
        this.autocompleter.disable();
      }
      var result = callback(e, this.text, this);*/
    }
    if (disableAutoCompleter)
    {
      this.autocompleter.disable();
    }
  }
  __getAutoCompletionOptions()
  {
    var commands = [];
    for (let command of this.commands.valid())
    {
      if (!command.startsWith("HOTKEY_") && command.startsWith(this.text))
      {
        commands.push(command);
      }
    }
    return commands;
  }
}

module.exports = CommandParser;
