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

    # 11: G => ( S ) 
    # 12: G => atom
    {
      lhs: "G",
      rhs: ["(","S",")"],
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
        "N":    shift 15
        "G":    shift 20
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
        "atom": shift 8
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
        "atom": shift 8
      },
      { # 10
        ")":    reduce 2
        "EOF":  reduce 2
      },
      { # 11
        "I":    shift 12
        "C":    shift 4
        "D":    shift 2
        "N":    shift 5
        "G":    shift 20
        "atom": shift 8
      },
      { # 12
        "<->":  reduce 4
        ")":    reduce 4
        "EOF":  reduce 4
      },
      { # 13
        "D":    shift 14
        "N":    shift 5
        "G":    shift 20
        "atom": shift 8
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
        "C":    shift 18
        "D":    shift 14
        "N":    shift 5
        "G":    shift 20
        "atom": shift 8
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

  getDerivation: (tokens) ->
    input_stack = []
    state_stack = [0]
    derivation = []

    console.log input_stack
    input_stack.push "EOF"
    console.log input_stack
    for token in tokens
      console.log [token,input_stack]
      input_stack.push token.type
      console.log input_stack
    input_stack.push "BOF"


    while input_stack.length > 0
      cur_input = input_stack[input_stack.length-1]
      cur_state = state_stack[state_stack.length-1]
      cur_action = @action_table[cur_state][cur_input]

      console.dir {
        input_stack: input_stack
        state_stack: state_stack
        derivation: derivation
        cur_action: cur_action
        cur_input: cur_input
        cur_state: cur_state
      }

      if cur_action?.type == "shift"
        state_stack.push cur_action.state
        input_stack.pop()
      else if cur_action?.type == "reduce"
        rule = @production_rules[cur_action.rule]
        derivation.push rule
        for i in rule.rhs
          state_stack.pop()
        input_stack.push rule.lhs
      else
        throw "ParseError"

    return derivation
        
