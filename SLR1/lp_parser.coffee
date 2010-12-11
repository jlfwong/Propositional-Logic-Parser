window.LPParser = class LPParser
  terminals: [
    "BOF",
    "atom",
    "<->",
    "->",
    "~",
    "^",
    "v",
    "(",
    ")",
    "EOF"
  ]

  nonterminals: [
    "S",
    "E",
    "I",
    "C",
    "D",
    "N",
    "G"
  ]

  production_rules: [
    # 0: S => BOF E EOF
    {
      lhs: "S"
      rhs: ["BOF","E","EOF"]
    },

    # 1: E => I <-> E 
    # 2: E => I
    {
      lhs: "E",
      rhs: ["I","<->","E"]
    },
    {
      lhs: "E",
      rhs: ["I"]
    },

    # 3: I => C -> I 
    # 4: I => C
    {
      lhs: "I",
      rhs: ["C","->","I"]
    },
    {
      lhs: "I",
      rhs: ["C"]
    },

    # 5: C => D v C
    # 6: C => D
    {
      lhs: "C",
      rhs: ["D","v","C"]
    },
    {
      lhs: "C",
      rhs: ["D"]
    },

    # 7: D => N ^ D 
    # 8: D => N
    {
      lhs: "D",
      rhs: ["N","^","D"]
    },
    {
      lhs: "D",
      rhs: ["N"]
    },

    # 9:  N => ~N 
    # 10: N => G
    {
      lhs: "N",
      rhs: ["~","N"]
    },
    {
      lhs: "N",
      rhs: ["G"]
    }

    # 11: G => ( E ) 
    # 12: G => atom
    {
      lhs: "G",
      rhs: ["(","E",")"],
    },
    {
      lhs: "G",
      rhs: ["atom"]
    }
  ]

  constructor: ->
    shift = (x) ->
      {
        type: "shift",
        state: x
      }

    reduce = (x) ->
      {
        type: "reduce",
        rule: x
      }

    @lexer = new LPLexer
    @action_table = [
      { # 0
        "BOF":  shift 1
      },
      { # 1
        "D":    shift 2
        "I":    shift 3
        "C":    shift 4
        "N":    shift 5
        "G":    shift 20
        "E":    shift 21
        "~":    shift 6
        "(":    shift 7
        "atom": shift 8
      },
      { # 2
        "v":    shift 18
        "<->":  reduce 6
        "->":   reduce 6
        ")":    reduce 6
        "EOF":  reduce 6
      },
      { # 3
        "<->":  shift 9
        ")":    reduce 2
        "EOF":  reduce 2
      },
      { # 4
        "->":   shift 11
        "<->":  reduce 4
        ")":    reduce 4
        "EOF":  reduce 4
      },
      { # 5
        "^":    shift 13
        "<->":  reduce 8
        "->":   reduce 8
        "v":    reduce 8
        ")":    reduce 8
        "EOF":  reduce 8
      },
      { # 6
        "~":    shift 6
        "N":    shift 15
        "G":    shift 20
        "(":    shift 7
        "atom": shift 8
      },
      { # 7
        "(":    shift 7
        "E":    shift 16
        "I":    shift 3
        "C":    shift 4
        "D":    shift 2
        "N":    shift 5
        "G":    shift 20
        "(":    shift 7
        "atom": shift 8
        "~":    shift 6
      },
      { # 8
        "<->":  reduce 12
        "->":   reduce 12
        "^":    reduce 12
        "v":    reduce 12
        ")":    reduce 12
        "EOF":  reduce 12
      },
      { # 9
        "E":    shift 10
        "I":    shift 3
        "C":    shift 4
        "D":    shift 2
        "N":    shift 5
        "G":    shift 20
        "(":    shift 7
        "atom": shift 8
        "~":    shift 6
      },
      { # 10
        ")":    reduce 1
        "EOF":  reduce 1
      },
      { # 11
        "I":    shift 12
        "C":    shift 4
        "D":    shift 2
        "N":    shift 5
        "G":    shift 20
        "(":    shift 7
        "atom": shift 8
        "~":    shift 6
      },
      { # 12
        "<->":  reduce 3
        ")":    reduce 3
        "EOF":  reduce 3
      },
      { # 13
        "D":    shift 14
        "N":    shift 5
        "G":    shift 20
        "(":    shift 7
        "atom": shift 8
        "~":    shift 6
      },
      { # 14
        "<->":  reduce 7
        "->":   reduce 7
        "v":    reduce 7
        ")":    reduce 7
        "EOF":  reduce 7
      },
      { # 15
        "<->":  reduce 9
        "->":   reduce 9
        "^":    reduce 9
        "v":    reduce 9
        ")":    reduce 9
        "EOF":  reduce 9
      },
      { # 16
        ")":    shift 17
      },
      { # 17
        "<->":  reduce 11
        "->":   reduce 11
        "^":    reduce 11
        "v":    reduce 11
        ")":    reduce 11
        "EOF":  reduce 11
      },
      { # 18
        "C":    shift 19
        "D":    shift 2
        "N":    shift 5
        "G":    shift 20
        "(":    shift 7
        "atom": shift 8
        "~":    shift 6
      },
      { # 19
        "<->":  reduce 5
        "->":   reduce 5
        ")":    reduce 5
        "EOF":  reduce 5
      },
      { # 20
        "<->":  reduce 10
        "->":   reduce 10
        "^":    reduce 10
        "v":    reduce 10
        ")":    reduce 10
        "EOF":  reduce 10
      },
      { # 21
        "EOF":  shift 22
      }
    ]

  # Takes a string as input and returns the parse tree
  parse: (input_string) ->
    tokens = @lexer.tokenize input_string

    input_stack = []
    state_stack = [0]
    output_stack = []


    input_stack.unshift {
      symbol: "BOF"
      terminal: true
      literal: "BOF"
    }
    for token in tokens
      input_stack.unshift {
        symbol: token.type
        terminal: true
        literal: token.lexeme
      }
    input_stack.unshift {
      symbol: "EOF"
      terminal: true
      literal: "EOF"
    }


    while input_stack.length > 0
      cur_input = input_stack[input_stack.length-1]
      cur_state = state_stack[state_stack.length-1]
      cur_action = @action_table[cur_state][cur_input.symbol]

      if cur_action?.type == "shift"
        state_stack.push cur_action.state
        output_stack.push cur_input
        input_stack.pop()
      else if cur_action?.type == "reduce"
        rule = @production_rules[cur_action.rule]

        parse_node =
          symbol: rule.lhs
          terminal: false
          rule: rule
          expansions: {}

        i = rule.rhs.length
        while (i -= 1) >= 0
          state_stack.pop()
          rhs_symbol = rule.rhs[i]
          output_stack_top = output_stack[output_stack.length - 1]
          if output_stack_top.symbol != rhs_symbol
            throw "StackError: Expecting #{rhs_symbol}, Got #{output_stack_top.symbol}"
          parse_node.expansions[rhs_symbol] = output_stack[output_stack.length - 1]
          output_stack.pop()

        input_stack.push parse_node
      else
        throw "ParseError"
    
    rule = @production_rules[0]

    start_parse_node =
      symbol: rule.lhs
      terminal: false
      rule: rule
      expansions: {}

    i = rule.rhs.length
    while (i -= 1) >= 0
      state_stack.pop()
      rhs_symbol = rule.rhs[i]
      start_parse_node.expansions[rhs_symbol] = output_stack[output_stack.length - 1]
      output_stack.pop()

    return start_parse_node
        