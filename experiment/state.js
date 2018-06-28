var Code = function (char) {
    if (char.length !== 1) {
        throw Error('Must pass single character.');
    }
    return char.charCodeAt(0);
};
var Stack = /** @class */ (function () {
    function Stack() {
        this.elements = [];
    }
    Stack.prototype.push = function (e) {
        this.elements.push(e);
    };
    Stack.prototype.pop = function () {
        return this.elements.pop();
    };
    Stack.prototype.isPair = function () {
        /// algorithm here
    };
    return Stack;
}());
;
var State;
(function (State) {
    State["Start"] = "start";
    State["Heading"] = "heading";
    State["Text"] = "text";
    State["Italic"] = "italic";
    State["Bold"] = "bold";
    State["OrderList"] = "order_list";
    State["UnorderList"] = "unoder_list";
    State["End"] = "end";
})(State || (State = {}));
var StateMachie = /** @class */ (function () {
    function StateMachie() {
        this.states = [];
        /// current tokenizing position
        this.pos = 0;
        /// some states are ambiguous
        this.pending = false;
        this.state = State.Start;
        this.pairs = [];
    }
    Object.defineProperty(StateMachie.prototype, "ch", {
        get: function () {
            return this.charCodeAt(this.pos);
        },
        enumerable: true,
        configurable: true
    });
    /// look forward
    StateMachie.prototype.forward = function (append) {
        return this.content.charCodeAt(this.pos + append);
    };
    StateMachie.prototype.initailize = function () {
        this.state = State.Start;
        this.pending = false;
        this.pos = 0;
    };
    StateMachie.prototype.process = function (content) {
        this.initailize();
        this.content = content;
        this.tokenize();
        if (!this.isResolved()) {
            throw Error('Final state must be resolved!');
        }
        console.log("\"" + this.content + "\" tokenized");
    };
    StateMachie.prototype.tokenize = function () {
        while (this.pos !== this.content.length) {
            switch (this.ch) {
                case Code('#'):
                    this.transfer(State.Heading);
                    /// heading rule
                    break;
                case Code('-'):
                    this.pendingTransfer(State.Italic);
                    if (this.ch === Code('-')) {
                        this.transfer(State.Bold);
                    }
                    else if (this.ch === Code('*')) {
                        this.transfer(State.Text);
                    }
                    else if (this.ch === Code(' ')) {
                        this.transfer(State.UnorderList);
                    }
                    else {
                        this.resolve();
                    }
                    break;
                case Code('*'):
                    this.pendingTransfer(State.Italic);
                    if (this.ch === Code('*')) {
                        this.transfer(State.Bold);
                    }
                    else if (this.ch === Code('-')) {
                        this.transfer(State.Text);
                    }
                    else if (this.ch === Code(' ')) {
                        this.transfer(State.UnorderList);
                    }
                    else {
                        this.resolve();
                    }
                    break;
                default:
                    this.transfer(State.Text);
                    break;
            }
        }
        this.transfer(State.End);
    };
    /// current state is resolved, or not
    StateMachie.prototype.isResolved = function () {
        if (this.pending) {
            return false;
        }
        else {
            return true;
        }
    };
    StateMachie.prototype.resolve = function () {
        this.pending = false;
        console.log("char: " + (this.content.charAt(this.pos) || ' ') + " pos: " + this.pos + ", state: " + this.state);
    };
    StateMachie.prototype.transfer = function (to) {
        this.state = to;
        console.log("char: " + (this.content.charAt(this.pos) || ' ') + " pos: " + this.pos + ", state: " + this.state);
        this.pos++;
        this.pending = false;
    };
    StateMachie.prototype.pendingTransfer = function (to) {
        this.state = to;
        this.pos++;
        this.pending = true;
    };
    StateMachie.prototype.isInitized = function () {
        return this.state === State.Start
            && this.pos === 0 && this.pending === false;
    };
    StateMachie.prototype.isEnd = function () {
        return this.state === State.End;
    };
    StateMachie.prototype.charCodeAt = function (pos) {
        return this.content.charCodeAt(pos);
    };
    return StateMachie;
}());
var machine = new StateMachie();
var test = function (content) {
    machine.process(content);
};
test('a**bla**');
test('# asd');
test('-italic-');
test('*italic*');
test('**bold**');
test('--bold--');
test('   ');
test('### h3');
//# sourceMappingURL=state.js.map