const CommandSyntax = require("./CommandSyntax.js");

class Command
{
    constructor(name, ...aliases)
    {
        this.name = name;
        this.aliases = aliases;
        this.syntax = [];
    }
    addSyntax(syntax)
    {
        this.syntax.push(new CommandSyntax(syntax));
    }
    submit(args)
    {
        console.error("Command %s registered with no \"submit\" method.%nArgs: %O", this.name, args);
    }
}

module.exports = Command;
