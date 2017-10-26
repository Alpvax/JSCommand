const CommandValue = require("./CommandValue.js");

class CommandSyntax {
  constructor(syntaxString) {
    //TODO:
    this.matchStr = syntaxString;
  }
  match(text) {
    var matchRe = this.matchStr
    .replace(/\[val:(.+?)\]/ig, (full, value) => "(?:" + CommandValue.getRegex(value).source + ")?")
    .replace(/<val:(.+?)</ig, (full, value) => CommandValue.getRegex(value).source);
    return matchRe.test(text);
  }
}

module.exports = CommandSyntax;
