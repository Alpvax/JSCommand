function load()
{
    var input = document.getElementById("textInput");
    var parser = new CommandParser(input);
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