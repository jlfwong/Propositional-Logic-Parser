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
    var tokenizer;
    tokenizer = new LPTokenizer;
    same(tokenizer.tokenize('A^A'), [
      {
        type: 'atom',
        lexeme: 'A'
      }, {
        type: '^',
        lexeme: '^'
      }, {
        type: 'atom',
        lexeme: 'A'
      }
    ]);
    same(tokenizer.tokenize('AvA'), [
      {
        type: 'atom',
        lexeme: 'A'
      }, {
        type: 'v',
        lexeme: 'v'
      }, {
        type: 'atom',
        lexeme: 'A'
      }
    ]);
    same(tokenizer.tokenize('A->A'), [
      {
        type: 'atom',
        lexeme: 'A'
      }, {
        type: '->',
        lexeme: '->'
      }, {
        type: 'atom',
        lexeme: 'A'
      }
    ]);
    same(tokenizer.tokenize('A<->A'), [
      {
        type: 'atom',
        lexeme: 'A'
      }, {
        type: '<->',
        lexeme: '<->'
      }, {
        type: 'atom',
        lexeme: 'A'
      }
    ]);
    same(tokenizer.tokenize('~A'), [
      {
        type: '~',
        lexeme: '~'
      }, {
        type: 'atom',
        lexeme: 'A'
      }
    ]);
    return same(tokenizer.tokenize('(A)'), [
      {
        type: '(',
        lexeme: '('
      }, {
        type: 'atom',
        lexeme: 'A'
      }, {
        type: ')',
        lexeme: ')'
      }
    ]);
  });
  test('errors', function() {
    var tokenizer;
    tokenizer = new LPTokenizer;
    assertThrows('ParseError', function() {
      return tokenizer.tokenize('<');
    });
    assertThrows('ParseError', function() {
      return tokenizer.tokenize('<-');
    });
    assertThrows('ParseError', function() {
      return tokenizer.tokenize('');
    });
    assertThrows('ParseError', function() {
      return tokenizer.tokenize('-');
    });
    assertThrows('ParseError', function() {
      return tokenizer.tokenize('x');
    });
    return assertThrows('ParseError', function() {
      return tokenizer.tokenize('*');
    });
  });
}).call(this);
