const VAL_REGISTRY = {};

class CommandValue
{
  constructor(name, values)
  {
    this.name = name;
    if (name in VAL_REGISTRY)
    {
      console.warn("Overwriting previously defined CommandValue with name \"%s\".", name);
    }
    VAL_REGISTRY[name] = this;
    this.values = values;
  }
  static get REGISTRY()
  {
    return VAL_REGISTRY;
  }
  static getRegex(valueType)
  {
    let value = VAL_REGISTRY[valueType];
    return value ? value.regex : null;
  }
  get regex()
  {
    return new RegExp(this.getCompletionValues("").join("|"), "i");
  }
  getCompletionValues(input)
  {
    var vals = [];
    for (let key in this.values)
    {
      let val = this.values[key];
      if (Array.isArray(val))
      {
        for (let v of val)
        {
          if (!input || v.startsWith(input))
          {
            vals.push(v);
          }
        }
      }
      else if (val instanceof RegExp && (!input || val.test(input)))
      {
        vals.push(key);
      }
      else
      {
        vals.push(val);
      }
    }
    return vals;
  }
  getValue(input)
  {
    let vals = this.getCompletionValues(input);
    return vals.length == 1 ? vals[0] : null;
  }
}

module.exports = CommandValue;
