/*class AutoCompleter
{
    constructor()
    {
        this.text = null;
        this.options = [];
    }
    trigger(text)
    {
        this.active = text;
        this.calculate();
    }
    calculate(text)
    {
        this.options = 
    }
}*/

class CommandParser
{
    constructor(inputText)
    {
        this.inputText = inputText;
        this.currentText = inputText.value;
        this.active = true;
        this.hotkeys = {};
        this.addHotkey("Enter", returnKeyBind);
        //this.addHotkey("Tab", returnKeyBind);
        this.addHotkey("Escape", escKeyBind);
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
        this.currentText = value;
    }
    /*setText(text, displayedOnly)
    {
        this.inputText.value = text;
        if(!displayedOnly)
        {
            this.currentText = text;
        }
    }*/
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
    __handleKeyDown(e)
    {
        if(!this.active)
        {
            return;
        }
        if(e.key in this.hotkeys)
        {
            var result = this.hotkeys[e.key](e, this.inputText.value, this);
        }
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

/*function tabKeyBind(e, input, parser)
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
}*/