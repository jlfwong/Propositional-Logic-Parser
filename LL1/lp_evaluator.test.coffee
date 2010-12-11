module 'LPEvaluator'

assertThrows = (error,fcn) ->
  correctError = false
  try
    fcn()
  catch e
    correctError = (error == e)
  ok correctError

assertValuations = (params) ->
  evaluator = new LPEvaluator
  formula = params.formula
  for trial in params.trials
    [valuation,expected] = trial
    equals expected, evaluator.evaluate(formula,valuation), formula

test 'atom', ->
  assertValuations {
    formula: 'A'
    trials: [
      [{'A':false},false],
      [{'A':true} ,true]
    ]
  }

test 'negation', ->
  assertValuations {
    formula: '~A'
    trials: [
      [{'A':false},true],
      [{'A':true}, false]
    ]
  }

test 'double negation', ->
  assertValuations {
    formula: '~~A'
    trials: [
      [{'A':false},false],
      [{'A':true}, true]
    ]
  }

test 'simple tautology', ->
  assertValuations {
    formula: '{Av~A}'
    trials: [
      [{'A':false},true],
      [{'A':true}, true]
    ]
  }

test 'simple contradiction', ->
  assertValuations {
    formula: '<A^~A>'
    trials: [
      [{'A':false},false],
      [{'A':true}, false]
    ]
  }

test 'and', ->
  assertValuations {
    formula: '<A^B>'
    trials: [
      [{'A':false, 'B':false},false],
      [{'A':false, 'B':true },false],
      [{'A':true , 'B':false},false],
      [{'A':true , 'B':true },true ]
    ]
  }

test 'or', ->
  assertValuations {
    formula: '{AvB}'
    trials: [
      [{'A':false, 'B':false},false],
      [{'A':false, 'B':true },true ],
      [{'A':true , 'B':false},true ],
      [{'A':true , 'B':true },true ]
    ]
  }

test 'implication', ->
  assertValuations {
    formula: '[A->B]'
    trials: [
      [{'A':false, 'B':false},true ],
      [{'A':false, 'B':true },true ],
      [{'A':true , 'B':false},false],
      [{'A':true , 'B':true },true ]
    ]
  }

test 'equivalence', ->
  assertValuations {
    formula: '(A<->B)'
    trials: [
      [{'A':false, 'B':false},true ],
      [{'A':false, 'B':true },false],
      [{'A':true , 'B':false},false],
      [{'A':true , 'B':true },true ]
    ]
  }

test 'order of operations', ->
  assertValuations {
    formula: '<A^/{~AvA}\\>'
    trials: [
      [{'A':false},false],
      [{'A':true },true ]
    ]
  }

  assertValuations {
    formula: '{Av/<~A^A>\\}'
    trials: [
      [{'A':false},false],
      [{'A':true },true ]
    ]
  }

  assertValuations {
    formula: '</{Av~A}\\^A>'
    trials: [
      [{'A':false},false],
      [{'A':true },true ]
    ]
  }

  assertValuations {
    formula: '{Av~/<A^A>\\}'
    trials: [
      [{'A':false},true ],
      [{'A':true },true ]
    ]
  }

  assertValuations {
    formula: '<~A^/{~AvA}\\>'
    trials: [
      [{'A':false},true ],
      [{'A':true },false]
    ]
  }

  assertValuations {
    formula: '///A\\\\\\'
    trials: [
      [{'A':false},false],
      [{'A':true },true ]
    ]
  }

  assertValuations {
    formula: '{~AvB}'
    trials: [
      [{'A':false, 'B':false},true ],
      [{'A':false, 'B':true },true ],
      [{'A':true , 'B':false},false],
      [{'A':true , 'B':true },true ]
    ]
  }
