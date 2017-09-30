class CommandComponent
{
    static get componentType()
    {
        console.warn("Class property \"componentType\" is not defined for %O\n" +
            "Using \"%s\" instead.", this, this.name);
        return this.name;
    }
    constructor(syntax)
    {
        this.syntax = syntax;
        if(this.constructor === CommandComponent)
        {
            throw new Error("Cannot instantiate " + CommandComponent.name + 
                " directly. Create a subclass with a defined class componentType.");
        }
        this.componentType;
    }
    get componentType()
    {
        return this.constructor.componentType;
    }
}

class SubComponentTest extends CommandComponent
{
}

module.exports.CommandComponent = CommandComponent;
module.exports.SubComponentTest = SubComponentTest;