(function() {
  var LPParser;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  window.LPParser = (function() {
    LPParser = (function() {
      function LPParser() {
        this.lexer = new LPLexer;
        this.predict = {
          "S": {
            "BOF": ["BOF", "E", "EOF"]
          },
          "E": {
            "(": ["(", "I", "<->", "E", ")"],
            "[": ["I"],
            "{": ["I"],
            "<": ["I"],
            "~": ["I"],
            "/": ["I"],
            "atom": ["I"]
          },
          "I": {
            "[": ["[", "C", "->", "I", "]"],
            "{": ["C"],
            "<": ["C"],
            "~": ["C"],
            "/": ["C"],
            "atom": ["C"]
          },
          "C": {
            "{": ["{", "D", "v", "C", "}"],
            "<": ["D"],
            "~": ["D"],
            "/": ["D"],
            "atom": ["D"]
          },
          "D": {
            "<": ["<", "N", "^", "D", ">"],
            "~": ["N"],
            "/": ["N"],
            "atom": ["N"]
          },
          "N": {
            "~": ["~", "N"],
            "/": ["G"],
            "atom": ["G"]
          },
          "G": {
            "/": ["/", "E", "\\"],
            "atom": ["atom"]
          }
        };
        return this;
      }
      return LPParser;
    })();
    LPParser.prototype.nonterminals = ["S", "E", "I", "C", "D", "N", "G"];
    LPParser.prototype.parse = function(input_string) {
      var a, curA, derivation, gamma, getParseTree, input_queue, parse_stack, reverse, symbol, _i, _j, _len, _len2, _ref;
      input_queue = this.lexer.tokenize(input_string);
      input_queue.unshift({
        type: "BOF",
        lexeme: "BOF"
      });
      input_queue.push({
        type: "EOF",
        lexeme: "EOF"
      });
      parse_stack = ["S"];
      derivation = [];
      for (_i = 0, _len = input_queue.length; _i < _len; _i++) {
        a = input_queue[_i];
        while (_ref = parse_stack[parse_stack.length - 1], __indexOf.call(this.nonterminals, _ref) >= 0) {
          curA = parse_stack.pop();
          gamma = this.predict[curA][a.type];
          if (gamma == null) {
            throw "ParseError";
          }
          derivation.push({
            terminal: false,
            lhs: curA,
            rhs: gamma
          });
          reverse = [];
          for (_j = 0, _len2 = gamma.length; _j < _len2; _j++) {
            symbol = gamma[_j];
            reverse.push(symbol);
          }
          while (reverse.length > 0) {
            parse_stack.push(reverse.pop());
          }
        }
        if (parse_stack[parse_stack.length - 1] !== a.type) {
          throw "ParseError";
        }
        derivation.push({
          terminal: true,
          lhs: a.type,
          rhs: a.lexeme
        });
        parse_stack.pop();
      }
      if (parse_stack.length > 0) {
        throw "ParseError";
      }
      getParseTree = function() {
        var curnode, rhs_symbol, _i, _len, _ref;
        curnode = {
          rule: derivation.shift(),
          expansions: {}
        };
        if (curnode.rule.terminal) {
          curnode.terminal = true;
          curnode.literal = curnode.rule.rhs;
        } else {
          curnode.terminal = false;
          _ref = curnode.rule.rhs;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            rhs_symbol = _ref[_i];
            curnode.expansions[rhs_symbol] = getParseTree();
          }
        }
        return curnode;
      };
      return getParseTree();
    };
    return LPParser;
  })();
}).call(this);
