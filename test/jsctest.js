const CommandParser = require("../src/CommandParser.js");
const Command = require("../src/Command.js");

class CommandMove extends Command
{
  parseArgs(commandLine)
  {
    return {
      "direction": commandLine
    };
  }
  submit(args)
  {
    console.debug(args);
    let direction = args["direction"];
    if (direction)
    {
      console.log("Moving %s", direction);
    }
    else
    {
      console.warn("No direction specified!!");
    }
  }
}

function onLoad(input)
{
  let data = require("./testData.json");
  let parser = new CommandParser(input).loadAliases(data.commands);
  parser.addCommand(new CommandMove("move"));
  parser.addCommand(new(require("../src/commands/CommandReload.js"))("reload"), true);
  parser.addCommand(new(require("../src/commands/CommandExit.js"))("exit"), true);
  parser.loadHotkeys(data.hotkeys);
}

module.exports = onLoad;
