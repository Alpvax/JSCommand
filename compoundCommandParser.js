const AutoCompleter = require("./AutoCompleter.js");

class CommandParser
{
    constructor(inputText, defaultSyntax)
    {
        this.inputText = inputText;
        this.defaultSyntax = defaultSyntax;
        this.active = true;
        this.hotkeys = {};
        this.autocompleter = new AutoCompleter(this);
        this.addHotkey("Enter", returnKeyBind);
        this.addHotkey("Escape", escKeyBind);
        this.addHotkey("Tab", this.autocomplete);
        this.inputText.addEventListener("keydown", this.__handleKeyDown.bind(this));
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
    clearText()
    {
        this.text = "";
    }
    /**
     * Use this to autocomplete the entry. arguments are keyEvent, current text, and the parser instance.
     */
    autocomplete(e, input, parser)
    {
        e.preventDefault();
        parser.autocompleter.fillNext(e.shiftKey);//Reverse diresction if shift held.
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

function returnKeyBind(e, input, parser)
{
    e.preventDefault();
    //TODO:parser.parseAndSubmit(inputText.value);
    console.log(input);
    parser.clearText();
}

function escKeyBind(e, input, parser)
{
    e.preventDefault();
    parser.clearText();
}

module.exports = CommandParser