(function() {
  var LPParser;
  window.LPParser = (function() {
    LPParser = (function() {
      function LPParser() {
        this.terminals = ["atom", "<->", "->", "~", "^", "v", "(", ")"];
        this.nonterminals = ["S", "E", "I", "C", "D", "N", "G"];
        this.rules = [["S", ["E"]], ["E", ["I <-> E", "I"]], ["I", ["C -> I", "I"]], ["C", ["D v C", "D"]], ["D", ["N ^ D", "N"]], ["N", ["~N", "G"]], ["G", ["( S )", "atom"]]];
        return this;
      }
      return LPParser;
    })();
    return LPParser;
  })();
}).call(this);
