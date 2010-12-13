window.LPEvaluator = class LPEvaluator
  constructor: ->
    @parser = new LPParser

  getValue: (parse_node, assignments) ->
    if parse_node.rule.rhs[0] == "BOF"
      return this.getValue(parse_node.expansions["E"],assignments)

    else if parse_node.terminal
      return assignments[parse_node.literal]

    else if parse_node.rule.rhs[0] == "~"
      return !this.getValue(parse_node.expansions["N"],assignments)

    else if parse_node.rule.rhs.length == 5
      switch (parse_node.rule.rhs[2])
        when "^"
          return  this.getValue(parse_node.expansions["N"],assignments) and
                  this.getValue(parse_node.expansions["D"],assignments)

        when "v"
          return  this.getValue(parse_node.expansions["D"],assignments) or
                  this.getValue(parse_node.expansions["C"],assignments)

        when "->"
          return  !this.getValue(parse_node.expansions["C"],assignments) or
                  this.getValue(parse_node.expansions["I"],assignments)

        when "<->"
          return  this.getValue(parse_node.expansions["I"],assignments) ==
                  this.getValue(parse_node.expansions["E"],assignments)

        else
          throw "EvaluationError"
    else if parse_node.rule.rhs[0] == "/"
      return  this.getValue(parse_node.expansions["E"],assignments)

    else if parse_node.rule.rhs.length == 1
      return this.getValue(parse_node.expansions[parse_node.rule.rhs[0]],assignments)

    else
      throw "EvaluationError"

  # Takes a string and an object as parameters, evaluating appropriately
  #
  # Example:
  #   evaluate 'A^B', {'A':true,'B':false}
  # Will return false
  evaluate: (formula, assignments) ->
    parse_tree = @parser.parse formula
    return this.getValue(parse_tree, assignments)
