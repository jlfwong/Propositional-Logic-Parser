(function() {
  var LPParser;
  window.LPParser = (function() {
    LPParser = (function() {
      function LPParser() {
        var reduce, shift;
        shift = function(x) {
          return {
            type: "shift",
            state: x
          };
        };
        reduce = function(x) {
          return {
            type: "reduce",
            rule: x
          };
        };
        this.action_table = [
          {
            "BOF": shift(1)
          }, {
            "D": shift(2),
            "I": shift(3),
            "C": shift(4),
            "N": shift(5),
            "G": shift(20),
            "E": shift(21),
            "~": shift(6),
            "(": shift(7),
            "atom": shift(8)
          }, {
            "v": shift(18),
            "<->": reduce(6),
            "->": reduce(6),
            ")": reduce(6),
            "EOF": reduce(6)
          }, {
            "<->": shift(9),
            ")": reduce(2),
            "EOF": reduce(2)
          }, {
            "->": shift(11),
            "<->": reduce(4),
            ")": reduce(4),
            "EOF": reduce(4)
          }, {
            "^": shift(13),
            "<->": reduce(8),
            "->": reduce(8),
            "v": reduce(8),
            ")": reduce(8),
            "EOF": reduce(8)
          }, {
            "N": shift(15),
            "G": shift(20),
            "atom": shift(8)
          }, {
            "(": shift(7),
            "E": shift(16),
            "I": shift(3),
            "C": shift(4),
            "D": shift(2),
            "N": shift(5),
            "G": shift(20),
            "atom": shift(8)
          }, {
            "<->": reduce(12),
            "->": reduce(12),
            "^": reduce(12),
            "v": reduce(12),
            ")": reduce(12),
            "EOF": reduce(12)
          }, {
            "E": shift(10),
            "I": shift(3),
            "C": shift(4),
            "D": shift(2),
            "N": shift(5),
            "G": shift(20),
            "atom": shift(8)
          }, {
            ")": reduce(2),
            "EOF": reduce(2)
          }, {
            "I": shift(12),
            "C": shift(4),
            "D": shift(2),
            "N": shift(5),
            "G": shift(20),
            "atom": shift(8)
          }, {
            "<->": reduce(4),
            ")": reduce(4),
            "EOF": reduce(4)
          }, {
            "D": shift(14),
            "N": shift(5),
            "G": shift(20),
            "atom": shift(8)
          }, {
            "<->": reduce(7),
            "->": reduce(7),
            "v": reduce(7),
            ")": reduce(7),
            "EOF": reduce(7)
          }, {
            "<->": reduce(9),
            "->": reduce(9),
            "^": reduce(9),
            "v": reduce(9),
            ")": reduce(9),
            "EOF": reduce(9)
          }, {
            ")": shift(17)
          }, {
            "<->": reduce(11),
            "->": reduce(11),
            "^": reduce(11),
            "v": reduce(11),
            ")": reduce(11),
            "EOF": reduce(11)
          }, {
            "C": shift(18),
            "D": shift(14),
            "N": shift(5),
            "G": shift(20),
            "atom": shift(8)
          }, {
            "<->": reduce(5),
            "->": reduce(5),
            ")": reduce(5),
            "EOF": reduce(5)
          }, {
            "<->": reduce(10),
            "->": reduce(10),
            "^": reduce(10),
            "v": reduce(10),
            ")": reduce(10),
            "EOF": reduce(10)
          }, {
            "EOF": shift(22)
          }
        ];
        return this;
      }
      return LPParser;
    })();
    LPParser.prototype.terminals = ["BOF", "atom", "<->", "->", "~", "^", "v", "(", ")", "EOF"];
    LPParser.prototype.nonterminals = ["S", "E", "I", "C", "D", "N", "G"];
    LPParser.prototype.production_rules = [
      {
        lhs: "S",
        rhs: ["BOF", "E", "EOF"]
      }, {
        lhs: "E",
        rhs: ["I", "<->", "E"]
      }, {
        lhs: "E",
        rhs: ["I"]
      }, {
        lhs: "I",
        rhs: ["C", "->", "I"]
      }, {
        lhs: "I",
        rhs: ["C"]
      }, {
        lhs: "C",
        rhs: ["D", "v", "C"]
      }, {
        lhs: "C",
        rhs: ["D"]
      }, {
        lhs: "D",
        rhs: ["N", "^", "D"]
      }, {
        lhs: "D",
        rhs: ["N"]
      }, {
        lhs: "N",
        rhs: ["~", "N"]
      }, {
        lhs: "N",
        rhs: ["G"]
      }, {
        lhs: "G",
        rhs: ["(", "S", ")"]
      }, {
        lhs: "G",
        rhs: ["atom"]
      }
    ];
    LPParser.prototype.getDerivation = function(tokens) {
      var cur_action, cur_input, cur_state, derivation, i, input_stack, rule, state_stack, token, _i, _j, _len, _len2, _ref;
      input_stack = [];
      state_stack = [0];
      derivation = [];
      console.log(input_stack);
      input_stack.push("EOF");
      console.log(input_stack);
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        console.log([token, input_stack]);
        input_stack.push(token.type);
        console.log(input_stack);
      }
      input_stack.push("BOF");
      while (input_stack.length > 0) {
        cur_input = input_stack[input_stack.length - 1];
        cur_state = state_stack[state_stack.length - 1];
        cur_action = this.action_table[cur_state][cur_input];
        console.dir({
          input_stack: input_stack,
          state_stack: state_stack,
          derivation: derivation,
          cur_action: cur_action,
          cur_input: cur_input,
          cur_state: cur_state
        });
        if ((cur_action != null ? cur_action.type : void 0) === "shift") {
          state_stack.push(cur_action.state);
          input_stack.pop();
        } else if ((cur_action != null ? cur_action.type : void 0) === "reduce") {
          rule = this.production_rules[cur_action.rule];
          derivation.push(rule);
          _ref = rule.rhs;
          for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
            i = _ref[_j];
            state_stack.pop();
          }
          input_stack.push(rule.lhs);
        } else {
          throw "ParseError";
        }
      }
      return derivation;
    };
    return LPParser;
  })();
}).call(this);
