module.exports = {
    Parser: require("./CommandParser.js"),
    Command: require("./Command.js"),
    CommandValue: require("./CommandValue.js"),
    Component: require("./CommandComponent.js").CommandComponent,
    version: require("./package.json").version
};