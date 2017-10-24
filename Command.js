class Command
{
    constructor(name, ...aliases)
    {
        this.name = name;
        this.aliases = aliases;
    }
}

module.exports = Command;