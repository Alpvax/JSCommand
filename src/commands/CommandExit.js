const {remote} = require("electron");
const Command = require("../Command.js");

class CommandExit extends Command
{
  submit(args)
  {
    let w = remote.getCurrentWindow();
    w.close();
  }
}

module.exports = CommandExit;
