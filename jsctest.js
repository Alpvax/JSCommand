function onLoad(input)
{
    let CommandParser = require("./compoundCommandParser.js");
    let parser = new CommandParser(input);
    let {CommandComponent, SubComponentTest} = require("./CommandComponent.js");
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