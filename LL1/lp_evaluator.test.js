(function() {
  var assertThrows, assertValuations;
  module('LPEvaluator');
  assertThrows = function(error, fcn) {
    var correctError;
    correctError = false;
    try {
      fcn();
    } catch (e) {
      correctError = error === e;
    }
    return ok(correctError);
  };
  assertValuations = function(params) {
    var evaluator, expected, formula, trial, valuation, _i, _len, _ref, _results;
    evaluator = new LPEvaluator;
    formula = params.formula;
    _ref = params.trials;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      trial = _ref[_i];
      valuation = trial[0], expected = trial[1];
      _results.push(equals(expected, evaluator.evaluate(formula, valuation), formula));
    }
    return _results;
  };
  test('atom', function() {
    return assertValuations({
      formula: 'A',
      trials: [
        [
          {
            'A': false
          }, false
        ], [
          {
            'A': true
          }, true
        ]
      ]
    });
  });
  test('negation', function() {
    return assertValuations({
      formula: '~A',
      trials: [
        [
          {
            'A': false
          }, true
        ], [
          {
            'A': true
          }, false
        ]
      ]
    });
  });
  test('double negation', function() {
    return assertValuations({
      formula: '~~A',
      trials: [
        [
          {
            'A': false
          }, false
        ], [
          {
            'A': true
          }, true
        ]
      ]
    });
  });
  test('simple tautology', function() {
    return assertValuations({
      formula: '{Av~A}',
      trials: [
        [
          {
            'A': false
          }, true
        ], [
          {
            'A': true
          }, true
        ]
      ]
    });
  });
  test('simple contradiction', function() {
    return assertValuations({
      formula: '<A^~A>',
      trials: [
        [
          {
            'A': false
          }, false
        ], [
          {
            'A': true
          }, false
        ]
      ]
    });
  });
  test('and', function() {
    return assertValuations({
      formula: '<A^B>',
      trials: [
        [
          {
            'A': false,
            'B': false
          }, false
        ], [
          {
            'A': false,
            'B': true
          }, false
        ], [
          {
            'A': true,
            'B': false
          }, false
        ], [
          {
            'A': true,
            'B': true
          }, true
        ]
      ]
    });
  });
  test('or', function() {
    return assertValuations({
      formula: '{AvB}',
      trials: [
        [
          {
            'A': false,
            'B': false
          }, false
        ], [
          {
            'A': false,
            'B': true
          }, true
        ], [
          {
            'A': true,
            'B': false
          }, true
        ], [
          {
            'A': true,
            'B': true
          }, true
        ]
      ]
    });
  });
  test('implication', function() {
    return assertValuations({
      formula: '[A->B]',
      trials: [
        [
          {
            'A': false,
            'B': false
          }, true
        ], [
          {
            'A': false,
            'B': true
          }, true
        ], [
          {
            'A': true,
            'B': false
          }, false
        ], [
          {
            'A': true,
            'B': true
          }, true
        ]
      ]
    });
  });
  test('equivalence', function() {
    return assertValuations({
      formula: '(A<->B)',
      trials: [
        [
          {
            'A': false,
            'B': false
          }, true
        ], [
          {
            'A': false,
            'B': true
          }, false
        ], [
          {
            'A': true,
            'B': false
          }, false
        ], [
          {
            'A': true,
            'B': true
          }, true
        ]
      ]
    });
  });
  test('order of operations', function() {
    assertValuations({
      formula: '<A^/{~AvA}\\>',
      trials: [
        [
          {
            'A': false
          }, false
        ], [
          {
            'A': true
          }, true
        ]
      ]
    });
    assertValuations({
      formula: '{Av/<~A^A>\\}',
      trials: [
        [
          {
            'A': false
          }, false
        ], [
          {
            'A': true
          }, true
        ]
      ]
    });
    assertValuations({
      formula: '</{Av~A}\\^A>',
      trials: [
        [
          {
            'A': false
          }, false
        ], [
          {
            'A': true
          }, true
        ]
      ]
    });
    assertValuations({
      formula: '{Av~/<A^A>\\}',
      trials: [
        [
          {
            'A': false
          }, true
        ], [
          {
            'A': true
          }, true
        ]
      ]
    });
    assertValuations({
      formula: '<~A^/{~AvA}\\>',
      trials: [
        [
          {
            'A': false
          }, true
        ], [
          {
            'A': true
          }, false
        ]
      ]
    });
    assertValuations({
      formula: '///A\\\\\\',
      trials: [
        [
          {
            'A': false
          }, false
        ], [
          {
            'A': true
          }, true
        ]
      ]
    });
    return assertValuations({
      formula: '{~AvB}',
      trials: [
        [
          {
            'A': false,
            'B': false
          }, true
        ], [
          {
            'A': false,
            'B': true
          }, true
        ], [
          {
            'A': true,
            'B': false
          }, false
        ], [
          {
            'A': true,
            'B': true
          }, true
        ]
      ]
    });
  });
}).call(this);
