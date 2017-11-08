const ValueNode = require("./ValueNode.js");

//TODO:Int vs float (currently float)
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
    this.removeOption(num);
  }
  /**Remove a range of numbers from start to end, inclusive */
  excludeRange(start, end)
  {
    this.removeIf((num) => num >= start && num <= end);
  }

  static fromSyntax(syntax)
  {
    //Replace range syntax with discrete numbers
    let syntaxArg = syntax.replace(/(-?\d+(?:\.\d+)?)(?:-|:|to|\.\.)(-?\d+(?:\.\d+)?)/g, (range, start, end) => Array.from(Array(end + 1 - start), (val, index) => index + parseFloat(start)));
    for(let arg of syntaxArg.split(/,;/g))
    {
      this.addNumber(parseFloat(arg));
    }
  }

  parse(text)
  {
    return parseFloat(text);
  }
}
