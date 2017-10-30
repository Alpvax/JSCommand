class Command
{
    constructor(name, ...aliases)
    {
        this.name = name;
        this.aliases = aliases;
    }
    submit(args)
    {
        console.error("Command %s registered with no \"submit\" method.%nArgs: %O", this.name, args);
    }
}

module.exports = Command;