(function() {
  var assertThrows;
  module('getTokens');
  assertThrows = function(error, fcn) {
    var correctError;
    correctError = false;
    try {
      fcn();
    } catch (e) {
      console.log("Threw: " + e);
      correctError = error === e;
    }
    return ok(correctError);
  };
  test('valid', function() {
    same(getTokens('A^A'), ['A', '^', 'A']);
    same(getTokens('A->A'), ['A', '->', 'A']);
    same(getTokens('A<->A'), ['A', '<->', 'A']);
    same(getTokens('~A'), ['~', 'A']);
    return same(getTokens('(A)'), ['(', 'A', ')']);
  });
  test('errors', function() {
    assertThrows('ParseError', function() {
      return getTokens('<');
    });
    assertThrows('ParseError', function() {
      return getTokens('<-');
    });
    assertThrows('ParseError', function() {
      return getTokens('');
    });
    return assertThrows('ParseError', function() {
      return getTokens('-');
    });
  });
}).call(this);
