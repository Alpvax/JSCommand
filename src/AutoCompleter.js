class AutoCompleter
{
  constructor(getOptionsCallback)
  {
    this.getOptions = getOptionsCallback;
    this.active = false;
    this.index = 0;
    this.options = [];
    this.numOptions = this.options.length;
  }
  getNext(reverseDirection)
  {
    if (!this.active)
    {
      this.enable(reverseDirection);
    }
    if (this.numOptions <= 0)
    {
      return null;
    }
    if (reverseDirection) //Opposite direction
    {
      this.index--;
    }
    else
    {
      this.index++;
    }
    this.index = (this.index + this.numOptions) % this.numOptions;
    return this.options[this.index];
  }
  enable(reverseDirection)
  {
    this.active = true;
    this.index = reverseDirection ? 0 : -1;
    this.options = this.getOptions();
    this.numOptions = this.options.length;
  }
  disable()
  {
    this.active = false;
    this.options = [];
  }
}
module.exports = AutoCompleter;
