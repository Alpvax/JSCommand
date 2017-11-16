module.exports = {
  Parser: require("./CommandParser.js"),
  Command: require("./src/Command.js"),
  //CommandValue: require("./CommandValue.js"),
  Value: require("./src/values/ValueNode"),
  version: require("./package.json").version
};
