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
    getValues(input)
    {
        var vals = [];
        for(let key in this.values)
        {
            let val = this.values[key];
            if(val instanceof RegExp && val.test(input))
            {
                vals.push(key);
            }
            vals.push(val);
        }
        return vals;
    }
    getValue(input)
    {
        console.warn("%s.getValue(input) method hasn't been overwritten. This CommandValue (%s) is redundant.", this.constructor.name, name);
        return input;
    }
}

module.exports = CommandValue;