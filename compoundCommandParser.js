class CommandParser
{
    constructor(inputText)
    {
        this.inputText = inputText;
        this.currentText = inputText.value;
        this.active = true;
        this.hotkeys = {};
        this.addHotkey("Enter", returnKeyBind)
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
        this.setText("", false);
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