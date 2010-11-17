(function() {
  var LPParser;
  var __hasProp = Object.prototype.hasOwnProperty;
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
            "~": shift(6),
            "N": shift(15),
            "G": shift(20),
            "(": shift(7),
            "atom": shift(8)
          }, {
            "(": shift(7),
            "E": shift(16),
            "I": shift(3),
            "C": shift(4),
            "D": shift(2),
            "N": shift(5),
            "G": shift(20),
            "(": shift(7),
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
            ")": reduce(1),
            "EOF": reduce(1)
          }, {
            "I": shift(12),
            "C": shift(4),
            "D": shift(2),
            "N": shift(5),
            "G": shift(20),
            "(": shift(7),
            "atom": shift(8)
          }, {
            "<->": reduce(3),
            ")": reduce(3),
            "EOF": reduce(3)
          }, {
            "D": shift(14),
            "N": shift(5),
            "G": shift(20),
            "(": shift(7),
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
            "C": shift(19),
            "D": shift(2),
            "N": shift(5),
            "G": shift(20),
            "(": shift(7),
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
        rhs: ["(", "E", ")"]
      }, {
        lhs: "G",
        rhs: ["atom"]
      }
    ];
    LPParser.prototype.logParseTree = function(parse_tree_node, indentation) {
      var i, node, output_str, rule, symbol, _ref, _results;
      indentation != null ? indentation : indentation = 0;
      i = indentation;
      output_str = "";
      while (i > 0) {
        output_str += "|";
        i -= 1;
      }
      rule = this.production_rules[parse_tree_node.rule];
      output_str += "" + rule.lhs + " => " + (rule.rhs.join(' '));
      console.log(output_str);
      _results = [];
      for (symbol in _ref = parse_tree_node.expansions) {
        if (!__hasProp.call(_ref, symbol)) continue;
        node = _ref[symbol];
        if (node.terminal) {
          continue;
        }
        _results.push(this.logParseTree(node, indentation + 1));
      }
      return _results;
    };
    LPParser.prototype.parse = function(tokens) {
      var cur_action, cur_input, cur_state, i, input_stack, output_stack, output_stack_top, parse_node, rhs_symbol, rule, start_parse_node, state_stack, token, _i, _len;
      console.group("--");
      input_stack = [];
      state_stack = [0];
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
        /*
        console.dir {
          input: input_stack
          output: output_stack
          state: cur_state
          cur_input: cur_input
          cur_action: cur_action
        }
        */
        if ((cur_action != null ? cur_action.type : void 0) === "shift") {
          state_stack.push(cur_action.state);
          output_stack.push(cur_input);
          input_stack.pop();
        } else if ((cur_action != null ? cur_action.type : void 0) === "reduce") {
          rule = this.production_rules[cur_action.rule];
          console.log("" + rule.lhs + " => " + (rule.rhs.join(' ')));
          parse_node = {
            symbol: rule.lhs,
            terminal: false,
            rule: cur_action.rule,
            expansions: {}
          };
          i = rule.rhs.length;
          while ((i -= 1) >= 0) {
            state_stack.pop();
            rhs_symbol = rule.rhs[i];
            output_stack_top = output_stack[output_stack.length - 1];
            if (output_stack_top.symbol !== rhs_symbol) {
              /*
              console.dir {
                cur_input: cur_input
                cur_state: cur_state
                cur_action: cur_action
                input_stack: input_stack
                output_stack: output_stack
                state_stack: state_stack
              }
              */
              throw "StackError: Expecting " + rhs_symbol + ", Got " + output_stack_top.symbol;
            }
            parse_node.expansions[rhs_symbol] = output_stack[output_stack.length - 1];
            output_stack.pop();
          }
          input_stack.push(parse_node);
        } else {
          console.dir({
            cur_input: cur_input,
            cur_state: cur_state,
            cur_action: cur_action,
            input_stack: input_stack,
            output_stack: output_stack,
            state_stack: state_stack
          });
          throw "ParseError";
        }
      }
      rule = this.production_rules[0];
      start_parse_node = {
        symbol: rule.lhs,
        terminal: false,
        rule: 0,
        expansions: {}
      };
      i = rule.rhs.length;
      while ((i -= 1) >= 0) {
        state_stack.pop();
        rhs_symbol = rule.rhs[i];
        start_parse_node.expansions[rhs_symbol] = output_stack[output_stack.length - 1];
        output_stack.pop();
      }
      console.groupEnd();
      return start_parse_node;
    };
    return LPParser;
  })();
}).call(this);
