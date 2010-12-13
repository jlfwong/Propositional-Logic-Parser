(function() {
  var LPEvaluator;
  window.LPEvaluator = (function() {
    LPEvaluator = (function() {
      function LPEvaluator() {
        this.parser = new LPParser;
        return this;
      }
      return LPEvaluator;
    })();
    LPEvaluator.prototype.getValue = function(parse_node, assignments) {
      if (parse_node.rule.rhs[0] === "BOF") {
        return this.getValue(parse_node.expansions["E"], assignments);
      } else if (parse_node.terminal) {
        return assignments[parse_node.literal];
      } else if (parse_node.rule.rhs[0] === "~") {
        return !this.getValue(parse_node.expansions["N"], assignments);
      } else if (parse_node.rule.rhs.length === 5) {
        switch (parse_node.rule.rhs[2]) {
          case "^":
            return this.getValue(parse_node.expansions["N"], assignments) && this.getValue(parse_node.expansions["D"], assignments);
          case "v":
            return this.getValue(parse_node.expansions["D"], assignments) || this.getValue(parse_node.expansions["C"], assignments);
          case "->":
            return !this.getValue(parse_node.expansions["C"], assignments) || this.getValue(parse_node.expansions["I"], assignments);
          case "<->":
            return this.getValue(parse_node.expansions["I"], assignments) === this.getValue(parse_node.expansions["E"], assignments);
          default:
            throw "EvaluationError";
        }
      } else if (parse_node.rule.rhs[0] === "/") {
        return this.getValue(parse_node.expansions["E"], assignments);
      } else if (parse_node.rule.rhs.length === 1) {
        return this.getValue(parse_node.expansions[parse_node.rule.rhs[0]], assignments);
      } else {
        throw "EvaluationError";
      }
    };
    LPEvaluator.prototype.evaluate = function(formula, assignments) {
      var parse_tree;
      parse_tree = this.parser.parse(formula);
      return this.getValue(parse_tree, assignments);
    };
    return LPEvaluator;
  })();
}).call(this);
