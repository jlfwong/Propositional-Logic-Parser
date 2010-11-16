(function() {
  var assertThrows;
  module('LPTokenizer');
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
    var parser, tokenizer;
    parser = new LPParser;
    tokenizer = new LPTokenizer;
    return same(parser.getDerivation(tokenizer.tokenize("A")), ["ASDF"]);
  });
}).call(this);
