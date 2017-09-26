function Command(tokeniserExpression, callback, ...aliases)
{
    this.tokeniserExpression = tokeniserExpression || ".*";
    this.hotkeys = {};
    this.handleCommand = function(tokens)
    {
        console.log(tokens);
        //return true; //to continue running command handler
    }.bind(this);//TODO: callback;
    this.aliases = aliases;
    this.addHotkey = function(hotkey, passArgs)
    {
        this.hotkeys[hotkey] = passArgs || "";
        return this;
    }.bind(this);
    this.handleHotkey = function(key, e, inputText, parser)
    {
        return !this.handleCommand(this.tokenise(inputText.value + this.hotkeys[key]));
    }.bind(this);
    this.tokenise = function(string)
    {
        return string.match(this.tokeniserExpression);
        //TODO: tokenise
    }.bind(this);
}

function CommandParser(inputText)
{
    this.inputText = inputText;
    this.currentText = inputText.value;
    this.active = true;
    this.activate = function()
    {
        this.active = true;
        return this;
    }.bind(this);
    this.deactivate = function()
    {
        this.active = false;
        return this;
    }.bind(this);
    this.setInputValue = function(text)
    {
        this.inputText.value = text;
    }.bind(this);
    this.clearText = function(text)
    {
        this.currentText = "";
        this.inputText.value = "";
        this.__autocomplete.text = null;
        this.__autocomplete.index = 0;
        this.__autocomplete.options = [];
    }.bind(this);
    this.__autocomplete = {
        text: null,
        index: 0,
        options: []
    };
    this.hotkeys = {};
    this.handlers = [];
    this.register = function(commandHandler)//TODO: add handlers directly to parser, not abstracted
    {
        console.log(commandHandler);
        this.handlers.push(commandHandler);
        if(commandHandler.hotkeys)
        {
            for(var hotkey in commandHandler.hotkeys)
            {
                this.hotkeys[hotkey] = commandHandler;
            }
        }
    }.bind(this);
    this.__handleKeyDown = function(e)
    {
        if(!this.active)
        {
            return;
        }
        var key = e.key;
        if(key in this.hotkeys)
        {
            var handler = this.hotkeys[key];
            /*if(!this.hotkeys[key].handleEvent(e, this.inputText, this))*/
            if(handler.handleHotkey(key, e, this.inputText, this))
            {
                return;
            }
        }
        if(!e.defaultPrevented)
        {
            this.currentText = this.inputText.value + key;
        }
    }.bind(this);
    this.getTabCompletionOptions = function(text)
    {
        console.log("Building autocomplete list for: %s", text);
        var options = [];
        for(var h of this.handlers)
        {
            for(var a of h.aliases)
            {
                if(a.startsWith(text))
                {
                    options.push(a);
                }
            }
        }
        return options;
    }.bind(this);
    this.parseAndSubmit = function()
    {
        console.log("Submitting: %O", this);
    }.bind(this);
    this.register(returnKeyHandler);
    this.register(tabKeyHandler);
    this.inputText.addEventListener("keydown", this.__handleKeyDown);//*/
    //this.inputText.addEventListener("keydown.commandParser", this.__handleKeyDown);
}

var returnKeyHandler = new Command(".*").addHotkey("Enter");
returnKeyHandler.handleHotkey = function(key, e, inputText, parser)
    {
        e.preventDefault();
        parser.parseAndSubmit(inputText.value);//TODO:?
        parser.clearText();
    }.bind(returnKeyHandler);
var tabKeyHandler = new Command(".*").addHotkey("Tab");
tabKeyHandler.handleHotkey = function(key, e, inputText, parser)
    {
        e.preventDefault();
        if(parser.__autocomplete.text != parser.currentText)
        {
            console.log("Text: %s;\t%s", parser.__autocomplete.text, parser.currentText);
            parser.__autocomplete.text = parser.currentText;
            parser.__autocomplete.options = parser.getTabCompletionOptions(parser.currentText);
            parser.__autocomplete.index = 0;
        }
        var index = parser.__autocomplete.index
        parser.setInputValue(parser.__autocomplete.options[index]);
        if(e.shiftKey)//Opposite direction
        {
            index--;
            if(index < 0)
            {
                index = parser.__autocomplete.options.length - 1;
            }
        }
        else
        {
            index++;
            if(index >= parser.__autocomplete.options.length)
            {
                index = 0;
            }
        }
        parser.__autocomplete.index = index;
    }.bind(tabKeyHandler);