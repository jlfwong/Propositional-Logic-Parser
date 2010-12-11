(function() {
  var assertThrows;
  module('LPLexer');
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
    var lexer;
    lexer = new LPLexer;
    same(lexer.tokenize('A^A'), [
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
    same(lexer.tokenize('AvA'), [
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
    same(lexer.tokenize('A->A'), [
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
    same(lexer.tokenize('A<->A'), [
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
    same(lexer.tokenize('~A'), [
      {
        type: '~',
        lexeme: '~'
      }, {
        type: 'atom',
        lexeme: 'A'
      }
    ]);
    same(lexer.tokenize('(A)'), [
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
    same(lexer.tokenize('[A]'), [
      {
        type: '[',
        lexeme: '['
      }, {
        type: 'atom',
        lexeme: 'A'
      }, {
        type: ']',
        lexeme: ']'
      }
    ]);
    same(lexer.tokenize('<A>'), [
      {
        type: '<',
        lexeme: '<'
      }, {
        type: 'atom',
        lexeme: 'A'
      }, {
        type: '>',
        lexeme: '>'
      }
    ]);
    return same(lexer.tokenize('"A"'), [
      {
        type: '"',
        lexeme: '"'
      }, {
        type: 'atom',
        lexeme: 'A'
      }, {
        type: '"',
        lexeme: '"'
      }
    ]);
  });
  test('errors', function() {
    var lexer;
    lexer = new LPLexer;
    assertThrows('LexingError', function() {
      return lexer.tokenize('<-');
    });
    assertThrows('LexingError', function() {
      return lexer.tokenize('');
    });
    assertThrows('LexingError', function() {
      return lexer.tokenize('-');
    });
    assertThrows('LexingError', function() {
      return lexer.tokenize('x');
    });
    return assertThrows('LexingError', function() {
      return lexer.tokenize('*');
    });
  });
}).call(this);
