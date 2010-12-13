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
      {},
      { # 1
        "BOF":  shift  2
      },
      { # 2
        "E":    shift 3
        "I":    shift 5
        "C":    shift 8
        "D":    shift 11
        "N":    shift 14
        "G":    shift 19
        "~":    shift 17
        "(":    shift 20
        "atom": shift 23
      },
      { # 3
        "EOF":  shift 4
      },
      { # 4
      },
      { # 5
        "EOF":  reduce 2
        "<->":  shift 6
        ")":    reduce 2
      },
      { # 6
        "E":    shift 7
        "I":    shift 5
        "C":    shift 8
        "D":    shift 11
        "N":    shift 14
        "G":    shift 19
        "~":    shift 17
        "(":    shift 20
        "atom": shift 23
      },
      { # 7
        "EOF":  reduce 1
        ")":    reduce 1
      },
      { # 8
        "EOF":  reduce 4
        "<->":  reduce 4
        "->":   shift 9
        ")":    reduce 4
      },
      { # 9
        "I":    shift 10
        "C":    shift 8
        "D":    shift 11
        "N":    shift 14
        "G":    shift 19
        "~":    shift 17
        "(":    shift 20
        "atom": shift 23
      },
      { # 10
        "EOF":  reduce 3
        "<->":  reduce 3
        ")":    reduce 3
      },
      { # 11
        "EOF":  reduce 6
        "<->":  reduce 6
        "->":   reduce 6
        "v":    shift 12
        ")":    reduce 6
      },
      { # 12
        "C":    shift 13
        "D":    shift 11
        "N":    shift 14
        "G":    shift 19
        "~":    shift 17
        "(":    shift 20
        "atom": shift 23
      },
      { # 13
        "EOF":  reduce 5
        "<->":  reduce 5
        "->":   reduce 5
        ")":    reduce 5
      },
      { # 14
        "EOF":  reduce 8
        "<->":  reduce 8
        "->":   reduce 8
        "v":    reduce 8
        "^":    shift 15
        ")":    reduce 8
      },
      { # 15
        "D":    shift 16
        "N":    shift 14
        "G":    shift 19
        "~":    shift 17
        "(":    shift 20
        "atom": shift 23
      },
      { # 16
        "EOF":  reduce 7
        "<->":  reduce 7
        "->":   reduce 7
        "v":    reduce 7
        ")":    reduce 7
      },
      { # 17
        "N":    shift 18
        "G":    shift 19
        "~":    shift 17
        "(":    shift 20
        "atom": shift 23
      },
      { # 18
        "EOF":  reduce 9
        "<->":  reduce 9
        "->":   reduce 9
        "v":    reduce 9
        "^":    reduce 9
        ")":    reduce 9
      },
      { # 19
        "EOF":  reduce 10
        "<->":  reduce 10
        "->":   reduce 10
        "v":    reduce 10
        "^":    reduce 10
        ")":    reduce 10
      },
      { # 20
        "E":    shift 21
        "I":    shift 5
        "C":    shift 8
        "D":    shift 11
        "N":    shift 14
        "G":    shift 19
        "~":    shift 17
        "(":    shift 20
        "atom": shift 23
      },
      { # 21
        ")":    shift 22
      },
      { # 22
        "EOF":  reduce 11
        "<->":  reduce 11
        "->":   reduce 11
        "v":    reduce 11
        "^":    reduce 11
        ")":    reduce 11
      },
      { # 23
        "EOF":  reduce 12
        "<->":  reduce 12
        "->":   reduce 12
        "v":    reduce 12
        "^":    reduce 12
        ")":    reduce 12
      }
    ]

  # Takes a string as input and returns the parse tree
  parse: (input_string) ->
    tokens = @lexer.tokenize input_string

    input_stack = []
    state_stack = [1]
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
        
