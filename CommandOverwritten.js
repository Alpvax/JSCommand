const Command = require("./Command.js");

class CommandOverwritten extends Command
{
    constructor(command)
    {
        this.overwrittenby = command;
    }
    submit(args)
    {
        return "Command overwritten by: " + this.overwrittenby;
    }
}

module.exports = CommandOverwritten;