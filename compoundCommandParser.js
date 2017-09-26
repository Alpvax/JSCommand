function CommandParser(inputText)
{
    this.inputText = inputText;
    this.currentText = inputText.value;
    this.active = true;
    this.hotkeys = {};
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
    this.setText = function(text, displayedOnly)
    {
        this.inputText.value = text;
        if(!displayedOnly)
        {
            this.currentText = text;
        }
    }.bind(this);
    this.addHotkey = function(key, callback)
    {
        if(key in this.hotkeys)
        {
            console.log("Replacing keybind \"%s\": %O with: %O", key, this.hotkeys[key], callback);
        }
        this.hotkeys[key] = callback;
    }.bind(this);
    this.clearText = function()
    {
        this.setText("", false);
    }.bind(this);
    this.__handleKeyDown = function(e)
    {
        if(!this.active)
        {
            return;
        }
        if(e.key in this.hotkeys)
        {
            var result = this.hotkeys[e.key](e, this.inputText.value, this);
        }
    }.bind(this);
    this.addHotkey("Enter", returnKeyBind)
    this.inputText.addEventListener("keydown", this.__handleKeyDown);
}
    
function returnKeyBind(e, input, parser)
{
    e.preventDefault();
    //TODO:parser.parseAndSubmit(inputText.value);
    console.log(input);
    parser.clearText();
}