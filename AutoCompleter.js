class AutoCompleter
{
    constructor(parser)
    {
        this.parser = parser;
        this.text = null;
        this.index = 0;
        this.options = [];
    }
    fillNext(reverseDirection)
    {
        if(this.text == null)
        {
            this.text = this.parser.text;
            this.index = 0;
            this.options = this.parser.__getAutoCompletionOptions();
        }
        if(this.options.length <= 0)
        {
            return;
        }
        this.parser.text = this.options[this.index];
        if(reverseDirection)//Opposite direction
        {
            this.index--;
            if(this.index < 0)
            {
                this.index = this.options.length - 1;
            }
        }
        else
        {
            this.index++;
            if(this.index >= this.options.length)
            {
                this.index = 0;
            }
        }
    }
    disable()
    {
        this.text = null;
        this.options = [];
    }
}
module.exports = AutoCompleter