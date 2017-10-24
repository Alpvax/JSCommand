const AutoCompleter = require("./AutoCompleter.js");

class CommandParser
{
    constructor(inputText)
    {
        this.inputText = inputText;
        this.active = true;
        this.hotkeys = {};
        this.autocompleter = new AutoCompleter(this);
        this.addHotkey("Enter", this.submit);
        this.addHotkey("Escape", this.clearText);
        this.addHotkey("Tab", this.autocomplete);
        this.inputText.addEventListener("keydown", this.__handleKeyDown.bind(this));
        this.commands = [];
    }
    activate()
    {
        this.active = true;
        return this;
    }
    deactivate()
    {
        this.active = false;
        return this;
    }
    get text()
    {
        return this.inputText.value
    }
    set text(value)
    {
        this.inputText.value = value
    }
    addHotkey(key, callback)
    {
        if(key in this.hotkeys)
        {
            console.log("Replacing keybind \"%s\": %O with: %O", key, this.hotkeys[key], callback);
        }
        this.hotkeys[key] = callback;
    }
    /**
     * Use this to clear all text from the entry. Optional argument is keyEvent (for convenience with addHotkey).
     */
    clearText(e)
    {
        if(e && (e instanceof KeyboardEvent))
        {
            e.preventDefault();
        }
        this.text = "";
    }
    /**
     * Use this to autocomplete the entry. Optional arguments are keyEvent for use with addHotkey and boolean to reverse direction.
     */
    autocomplete(e, reverse)
    {
        var reverseDirection = false;
        if(e && (e instanceof KeyboardEvent))
        {
            e.preventDefault();
            reverseDirection = e.shiftKey;//Reverse diresction if shift held.
        }
        if(reverse)
        {
            reverseDirection = true;
        }
        this.autocompleter.fillNext(reverseDirection);
    }
    /**
     * Use this to submit the command. Optional argument is keyEvent (for convenience with addHotkey).
     */
    submit(e)
    {
        if(e && (e instanceof KeyboardEvent))
        {
            e.preventDefault();
        }
        console.log(input);
        let handled = true;//TODO
        if(handled)
        {
            parser.clearText();
        }
        return handled;
    }
    get usage()
    {
        //TODO: Usage
    }
    __handleKeyDown(e)
    {
        if(!this.active)
        {
            return;
        }
        if(e.key in this.hotkeys)
        {
            let callback = this.hotkeys[e.key];
            if(callback != this.autocomplete)
            {
                this.autocompleter.disable();
            }
            var result = callback(e, this.inputText.value, this);
        }
    }
    __getAutoCompletionOptions()
    {
        return [];//TODO
    }
}

module.exports = CommandParser