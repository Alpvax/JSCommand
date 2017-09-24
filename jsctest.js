function load()
{
    var input = document.getElementById("textInput");
    var parser = new CommandParser(input);
    
    parser.register(new Command("walk", null, function(e, inputText, parser)
    {
        console.log("MOVING!!!");
        return true;
    }, "move", "go"));
    
    parser.register(new Command("wish", null, function(e, inputText, parser)
    {
        console.log("Wish upon a star!");
        return true;
    }, "hope", "pray"));
}

function parseInput(e)
{
    var input = e.srcElement;
    if(e.key.toLowerCase() =="enter")
    {
        e.preventDefault();
        input.value = "";
    }
    if(e.key.toLowerCase() =="tab")
    {
        e.preventDefault();
    }
    console.log(e);
}