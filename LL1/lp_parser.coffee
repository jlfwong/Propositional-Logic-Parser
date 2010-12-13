window.LPParser = class LPParser
  nonterminals: [
    "S",
    "E",
    "I",
    "C",
    "D",
    "N",
    "G"
  ]

  constructor: ->
    @lexer = new LPLexer
    @predict = {
      "S": {
        "BOF": ["BOF","E","EOF"],
      },
      "E": {
        "(":    ["(","I","<->","E",")"],
        "[":    ["I"],
        "{":    ["I"],
        "<":    ["I"],
        "~":    ["I"],
        "/":    ["I"],
        "atom": ["I"]
      },
      "I": {
        "[":    ["[","C","->","I","]"],
        "{":    ["C"],
        "<":    ["C"],
        "~":    ["C"],
        "/":    ["C"],
        "atom": ["C"]
      },
      "C": {
        "{":    ["{","D","v","C","}"],
        "<":    ["D"],
        "~":    ["D"],
        "/":    ["D"],
        "atom": ["D"]
      },
      "D": {
        "<":    ["<","N","^","D",">"],
        "~":    ["N"],
        "/":    ["N"],
        "atom": ["N"]
      },
      "N": {
        "~":    ["~","N"],
        "/":    ["G"],
        "atom": ["G"]
      },
      "G": {
        "/":    ["/","E","\\"],
        "atom": ["atom"]
      }
    }

  # Takes a string as input and returns the parse tree
  parse: (input_string) ->
    input_queue = @lexer.tokenize input_string

    input_queue.unshift {
      type: "BOF",
      lexeme: "BOF"
    }

    input_queue.push {
      type: "EOF",
      lexeme: "EOF"
    }

    parse_stack = ["S"]

    derivation = []

    for a in input_queue
      while parse_stack[parse_stack.length - 1] in @nonterminals
        curA = parse_stack.pop()
        gamma = @predict[curA][a.type]

        unless gamma?
          throw "ParseError"

        derivation.push {
          terminal: false
          lhs: curA,
          rhs: gamma
        }
        reverse = []
        for symbol in gamma
          reverse.push symbol
        while reverse.length > 0
          parse_stack.push reverse.pop()
      if parse_stack[parse_stack.length - 1] != a.type
        throw "ParseError"

      derivation.push {
        terminal: true
        lhs: a.type,
        rhs: a.lexeme
      }
      parse_stack.pop()

    if parse_stack.length > 0
      throw "ParseError"

    getParseTree = () ->
      curnode = {
        rule: derivation.shift(),
        expansions: {}
      }

      if curnode.rule.terminal
        curnode.terminal = true
        curnode.literal = curnode.rule.rhs
      else
        curnode.terminal = false
        for rhs_symbol in curnode.rule.rhs
          curnode.expansions[rhs_symbol] = getParseTree()

      return curnode

    getParseTree()
