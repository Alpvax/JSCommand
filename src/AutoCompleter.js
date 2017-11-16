class AutoCompleter
{
  constructor(parser)
  {
    this.parser = parser;
    this.active = false;
    this.index = 0;
    this.options = [];
  }
  fillNext(reverseDirection)
  {
    if (!this.active)
    {
      this.active = true;
      this.index = reverseDirection ? 0 : -1;
      this.options = this.parser.__getAutoCompletionOptions();
    }
    if (this.options.length <= 0)
    {
      return;
    }
    if (reverseDirection) //Opposite direction
    {
      this.index--;
      if (this.index < 0)
      {
        this.index = this.options.length + this.index;
      }
    }
    else
    {
      this.index++;
      if (this.index >= this.options.length)
      {
        this.index = 0;
      }
    }
    this.parser.text = this.options[this.index];
  }
  disable()
  {
    this.active = false;
    this.options = [];
  }
}
module.exports = AutoCompleter;
