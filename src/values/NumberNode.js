const ValueNode = require("./ValueNode.js");

class NumberNode extends ValueNode
{
  addNumber(num)
  {
    this.addOption(num);
  }
  /**Add a range of numbers from start to end, inclusive */
  addRange(start, end)
  {
    for(let num = start; num <= end; num++)
    {
      this.addOption(num);
    }
  }
  excludeNumber(num)
  {
    this.addOption(num);
  }
  /**Remove a range of numbers from start to end, inclusive */
  excludeRange(start, end)
  {
    this.addOption(num);
  }

  parse(text)
  {
    return parseFloat(text);
  }
}
