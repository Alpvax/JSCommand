const CommandNode = require("../CommandNode.js");

class ValueNode extends CommandNode
{
  constructor(...args)
  {
    this.options = [...args];
  }
  addOption(option)
  {
    if(!this.options.includes(option))
    {
      this.options.push(option);
    }
  }
  removeOption(option)
  {
    if(this.options.includes(option))
    {
      this.removeIf((opt) => opt == option);
    }
  }
  removeIf(filterFunc)
  {
    this.options = this.options.filter((opt) => !filterFunc(opt));
  }
  sortOptions(comparator)
  {
    this.options.sort(comparator);
  }

  getCompletionOptions(partialText)
  {
    return this.options.reduce((arr, option) => {
      let optStr = option.toString();
      if(optStr.startsWith(partialText))
      {
        arr.push(optStr);
      }
      return arr;
    },[]);
  }
}

module.exports = ValueNode;
module.exports.Number = require("./NumberNode.js");
