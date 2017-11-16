const Command = require("../Command.js");

class CommandReload extends Command
{
  submit(args)
  {
    location.reload();
  }
}

module.exports = CommandReload;
