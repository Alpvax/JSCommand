const CommandParser = require("../CommandParser.js");
const Command = require("../src/Command.js");

class CommandMove extends Command {
    parseArgs(commandLine) {
        return {
            "direction": commandLine
        };
    }
    submit(args) {
        console.debug(args);
        let direction = args["direction"];
        if(direction) {
            console.log("Moving %s", direction);
        } else {
          console.warn("No direction specified!!");
        }
    }
}

function onLoad(input) {
    let parser = new CommandParser(input).loadAliases(require("./aliasTest.json"));
    parser.addCommand(new CommandMove("move"));
}

module.exports = onLoad;
