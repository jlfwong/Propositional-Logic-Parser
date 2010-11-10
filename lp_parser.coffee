window.LPParser = class LPParser
  terminals: [
    "atom",
    "<->",
    "->",
    "~",
    "^",
    "v",
    "(",
    ")"
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

  constructor: ->
    @rules = [
      ["S", [
        "E",
      ]],
      ["E", [
        "I <-> E",
        "I"
      ]],
      ["I", [
        "C -> I",
        "I"
      ]],
      ["C", [
        "D v C",
        "D"
      ]],
      ["D", [
        "N ^ D",
        "N"
      ]],
      ["N", [
        "~N",
        "G"
      ]],
      ["G", [
        "( S )",
        "atom"
      ]]
    ]
