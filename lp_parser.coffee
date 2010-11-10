window.LPParser = class LPParser
  constructor: ->
    @terminals = [
      "atom",
      "<->",
      "->",
      "~",
      "^",
      "v",
      "(",
      ")"
    ]

    @nonterminals = [
      "S",
      "E",
      "I",
      "C",
      "D",
      "N",
      "G"
    ]

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
