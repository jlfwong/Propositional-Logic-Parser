module 'LPLexer'

assertThrows = (error,fcn) ->
  correctError = false
  try
    fcn()
  catch e
    correctError = (error == e)
  ok correctError

test 'valid', ->
  lexer = new LPLexer
  same (lexer.tokenize 'A^A'), [
    {type: 'atom',  lexeme: 'A'},
    {type: '^',     lexeme: '^'},
    {type: 'atom',  lexeme: 'A'}
  ]
  same (lexer.tokenize 'AvA'), [
    {type: 'atom',  lexeme: 'A'},
    {type: 'v',     lexeme: 'v'}
    {type: 'atom',  lexeme: 'A'}
  ]
  same (lexer.tokenize 'A->A'), [
    {type: 'atom',  lexeme: 'A'},
    {type: '->',    lexeme: '->'},
    {type: 'atom',  lexeme: 'A'}
  ]
  same (lexer.tokenize 'A<->A'), [
    {type: 'atom',  lexeme: 'A'},
    {type: '<->',   lexeme: '<->'},
    {type: 'atom',  lexeme: 'A'}
  ]
  same (lexer.tokenize '~A'), [
    {type: '~',     lexeme: '~'},
    {type: 'atom',  lexeme: 'A'}
  ]
  same (lexer.tokenize '(A)'), [
    {type: '(',     lexeme: '('},
    {type: 'atom',  lexeme: 'A'},
    {type: ')',     lexeme: ')'},
  ]

test 'errors', ->
  lexer = new LPLexer
  assertThrows 'ParseError', ->
    lexer.tokenize '<'
  assertThrows 'ParseError', ->
    lexer.tokenize '<-'
  assertThrows 'ParseError', ->
    lexer.tokenize ''
  assertThrows 'ParseError', ->
    lexer.tokenize '-'
  assertThrows 'ParseError', ->
    lexer.tokenize 'x'
  assertThrows 'ParseError', ->
    lexer.tokenize '*'
