const CommandParser = require("./compoundCommandParser.js");
const {CommandComponent, SubComponentTest} = require("./CommandComponent.js");

function onLoad(input)
{
    let parser = new CommandParser(input);
    parser.__getAutoCompletionOptions = function()//Force some autoCompletions until fully implemented.
    {
        return ["walk", "run", "pray"];
    }
    //new CommandComponent("noSyntax");
    new SubComponentTest("noSyntax");
}

function loadAutoComplete()//Not called
{
    var input = document.getElementById("textInput");
    var parser = new CommandParser(input);
    
    parser.register(new Command(/\w+(\s+(\w+))*/i, function(e, inputText, parser)
    {
        console.log("MOVING!!!");
        return true;
    }, "walk", "move", "go"));
    
    parser.register(new Command(/.*/, function(e, inputText, parser)
    {
        console.log("Wish upon a star!");
        return true;
    }, "wish", "hope", "pray"));
}
module.exports = onLoad;