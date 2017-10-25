function versionDisplay()
{
    let pkg = require("./package.json");
    console.info("Using %s version %s.", pkg.name, pkg.version);
}

module.exports = {
    Parser: require("./CommandParser.js"),
    Command: require("./Command.js"),
    CommandValue: require("./CommandValue.js"),
    Component: require("./CommandComponent.js").CommandComponent,
    info: versionDisplay
};