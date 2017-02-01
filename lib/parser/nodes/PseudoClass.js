var List = require('../../utils/list');
var TYPE = require('../../scanner').TYPE;

var COLON = TYPE.Colon;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var RIGHTPARENTESIS = TYPE.RightParenthesis;
var DISALLOW_VAR = false;
var BALANCED = true;

// : ( ident | function )
module.exports = function PseudoClass() {
    var start = this.scanner.tokenStart;
    var name;
    var children = null;

    this.scanner.eat(COLON);
    name = this.readIdent(DISALLOW_VAR);

    if (this.scanner.tokenType === LEFTPARENTHESIS) {
        var nameLowerCase = name.toLowerCase();

        this.scanner.next();

        if (this.pseudo.hasOwnProperty(nameLowerCase)) {
            this.readSC();
            children = this.pseudo[nameLowerCase].call(this);
            this.readSC();
        } else {
            children = new List().appendData(this.Raw(BALANCED, 0, 0));
        }

        this.scanner.eat(RIGHTPARENTESIS);
    }

    return {
        type: 'PseudoClass',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: name,
        children: children
    };
};