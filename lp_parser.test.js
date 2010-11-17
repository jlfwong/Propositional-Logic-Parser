(function() {
  var assertThrows;
  module('LPParser');
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
  test('valid', function() {
    var parser, tokenizer, trial, trials, _i, _len, _results;
    parser = new LPParser;
    tokenizer = new LPTokenizer;
    trials = ["A^(BvC)", "A->B", "A<->B", "A^B^C", "AvB", "AvBvC", "Av(B^C)vD", "A^B", "A", "((((A))))", "~A", "~~~~~~~~~A", "~A<->~B->~C^~Dv~E"];
    _results = [];
    for (_i = 0, _len = trials.length; _i < _len; _i++) {
      trial = trials[_i];
      _results.push(ok(parser.parse(tokenizer.tokenize(trial)), trial));
    }
    return _results;
  });
  test('errors', function() {
    var parser, tokenizer, trials, _fn, _i, _len, _results;
    parser = new LPParser;
    tokenizer = new LPTokenizer;
    trials = ["", "^", "v", "(", "(((", "((())", ")", ")(", "~", "AA", "->", "<->", "A->->B", "A<-><->B"];
    _fn = function(trial) {
      return assertThrows("ParseError", function() {
        return parser.parse(tokenizer.tokenize(trial));
      });
    };
    _results = [];
    for (_i = 0, _len = trials.length; _i < _len; _i++) {
      trial = trials[_i];
      _results.push(_fn(trial));
    }
    return _results;
  });
}).call(this);
