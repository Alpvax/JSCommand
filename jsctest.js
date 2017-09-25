function load()
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