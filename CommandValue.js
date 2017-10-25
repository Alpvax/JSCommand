const VAL_REGISTRY = {} 

class CommandValue
{
    constructor(name, values)
    {
        this.name = name;
        if(name in VAL_REGISTRY)
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
    getCompletionValues(input)
    {
        var vals = [];
        for(let key in this.values)
        {
            let val = this.values[key];
            if(Array.isArray(val))
            {
                for(let v of val)
                {
                    if(v.startsWith(input))
                    {
                        vals.push(v);
                    }
                }
            }
            else if(val instanceof RegExp && val.test(input))
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