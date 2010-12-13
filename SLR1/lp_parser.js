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
        this.lexer = new LPLexer;
        this.action_table = [
          {}, {
            "BOF": shift(2)
          }, {
            "E": shift(3),
            "I": shift(5),
            "C": shift(8),
            "D": shift(11),
            "N": shift(14),
            "G": shift(19),
            "~": shift(17),
            "(": shift(20),
            "atom": shift(23)
          }, {
            "EOF": shift(4)
          }, {}, {
            "EOF": reduce(2),
            "<->": shift(6),
            ")": reduce(2)
          }, {
            "E": shift(7),
            "I": shift(5),
            "C": shift(8),
            "D": shift(11),
            "N": shift(14),
            "G": shift(19),
            "~": shift(17),
            "(": shift(20),
            "atom": shift(23)
          }, {
            "EOF": reduce(1),
            ")": reduce(1)
          }, {
            "EOF": reduce(4),
            "<->": reduce(4),
            "->": shift(9),
            ")": reduce(4)
          }, {
            "I": shift(10),
            "C": shift(8),
            "D": shift(11),
            "N": shift(14),
            "G": shift(19),
            "~": shift(17),
            "(": shift(20),
            "atom": shift(23)
          }, {
            "EOF": reduce(3),
            "<->": reduce(3),
            ")": reduce(3)
          }, {
            "EOF": reduce(6),
            "<->": reduce(6),
            "->": reduce(6),
            "v": shift(12),
            ")": reduce(6)
          }, {
            "C": shift(13),
            "D": shift(11),
            "N": shift(14),
            "G": shift(19),
            "~": shift(17),
            "(": shift(20),
            "atom": shift(23)
          }, {
            "EOF": reduce(5),
            "<->": reduce(5),
            "->": reduce(5),
            ")": reduce(5)
          }, {
            "EOF": reduce(8),
            "<->": reduce(8),
            "->": reduce(8),
            "v": reduce(8),
            "^": shift(15),
            ")": reduce(8)
          }, {
            "D": shift(16),
            "N": shift(14),
            "G": shift(19),
            "~": shift(17),
            "(": shift(20),
            "atom": shift(23)
          }, {
            "EOF": reduce(7),
            "<->": reduce(7),
            "->": reduce(7),
            "v": reduce(7),
            ")": reduce(7)
          }, {
            "N": shift(18),
            "G": shift(19),
            "~": shift(17),
            "(": shift(20),
            "atom": shift(23)
          }, {
            "EOF": reduce(9),
            "<->": reduce(9),
            "->": reduce(9),
            "v": reduce(9),
            "^": reduce(9),
            ")": reduce(9)
          }, {
            "EOF": reduce(10),
            "<->": reduce(10),
            "->": reduce(10),
            "v": reduce(10),
            "^": reduce(10),
            ")": reduce(10)
          }, {
            "E": shift(21),
            "I": shift(5),
            "C": shift(8),
            "D": shift(11),
            "N": shift(14),
            "G": shift(19),
            "~": shift(17),
            "(": shift(20),
            "atom": shift(23)
          }, {
            ")": shift(22)
          }, {
            "EOF": reduce(11),
            "<->": reduce(11),
            "->": reduce(11),
            "v": reduce(11),
            "^": reduce(11),
            ")": reduce(11)
          }, {
            "EOF": reduce(12),
            "<->": reduce(12),
            "->": reduce(12),
            "v": reduce(12),
            "^": reduce(12),
            ")": reduce(12)
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
        rhs: ["(", "E", ")"]
      }, {
        lhs: "G",
        rhs: ["atom"]
      }
    ];
    LPParser.prototype.parse = function(input_string) {
      var cur_action, cur_input, cur_state, i, input_stack, output_stack, output_stack_top, parse_node, rhs_symbol, rule, start_parse_node, state_stack, token, tokens, _i, _len;
      tokens = this.lexer.tokenize(input_string);
      input_stack = [];
      state_stack = [1];
      output_stack = [];
      input_stack.unshift({
        symbol: "BOF",
        terminal: true,
        literal: "BOF"
      });
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        input_stack.unshift({
          symbol: token.type,
          terminal: true,
          literal: token.lexeme
        });
      }
      input_stack.unshift({
        symbol: "EOF",
        terminal: true,
        literal: "EOF"
      });
      while (input_stack.length > 0) {
        cur_input = input_stack[input_stack.length - 1];
        cur_state = state_stack[state_stack.length - 1];
        cur_action = this.action_table[cur_state][cur_input.symbol];
        if ((cur_action != null ? cur_action.type : void 0) === "shift") {
          state_stack.push(cur_action.state);
          output_stack.push(cur_input);
          input_stack.pop();
        } else if ((cur_action != null ? cur_action.type : void 0) === "reduce") {
          rule = this.production_rules[cur_action.rule];
          parse_node = {
            symbol: rule.lhs,
            terminal: false,
            rule: rule,
            expansions: {}
          };
          i = rule.rhs.length;
          while ((i -= 1) >= 0) {
            state_stack.pop();
            rhs_symbol = rule.rhs[i];
            output_stack_top = output_stack[output_stack.length - 1];
            if (output_stack_top.symbol !== rhs_symbol) {
              throw "StackError: Expecting " + rhs_symbol + ", Got " + output_stack_top.symbol;
            }
            parse_node.expansions[rhs_symbol] = output_stack[output_stack.length - 1];
            output_stack.pop();
          }
          input_stack.push(parse_node);
        } else {
          throw "ParseError";
        }
      }
      rule = this.production_rules[0];
      start_parse_node = {
        symbol: rule.lhs,
        terminal: false,
        rule: rule,
        expansions: {}
      };
      i = rule.rhs.length;
      while ((i -= 1) >= 0) {
        state_stack.pop();
        rhs_symbol = rule.rhs[i];
        start_parse_node.expansions[rhs_symbol] = output_stack[output_stack.length - 1];
        output_stack.pop();
      }
      return start_parse_node;
    };
    return LPParser;
  })();
}).call(this);
