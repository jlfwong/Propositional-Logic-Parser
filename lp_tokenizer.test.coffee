module 'LPTokenizer'

assertThrows = (error,fcn) ->
  correctError = false
  try
    fcn()
  catch e
    correctError = (error == e)
  ok correctError

test 'valid', ->
  tokenizer = new LPTokenizer
  same (tokenizer.tokenize 'A^A'), [
    {type: 'atom',  lexeme: 'A'},
    {type: '^',     lexeme: '^'},
    {type: 'atom',  lexeme: 'A'}
  ]
  same (tokenizer.tokenize 'AvA'), [
    {type: 'atom',  lexeme: 'A'},
    {type: 'v',     lexeme: 'v'}
    {type: 'atom',  lexeme: 'A'}
  ]
  same (tokenizer.tokenize 'A->A'), [
    {type: 'atom',  lexeme: 'A'},
    {type: '->',    lexeme: '->'},
    {type: 'atom',  lexeme: 'A'}
  ]
  same (tokenizer.tokenize 'A<->A'), [
    {type: 'atom',  lexeme: 'A'},
    {type: '<->',   lexeme: '<->'},
    {type: 'atom',  lexeme: 'A'}
  ]
  same (tokenizer.tokenize '~A'), [
    {type: '~',     lexeme: '~'},
    {type: 'atom',  lexeme: 'A'}
  ]

test 'errors', ->
  tokenizer = new LPTokenizer
  assertThrows 'ParseError', ->
    tokenizer.tokenize '<'
  assertThrows 'ParseError', ->
    tokenizer.tokenize '<-'
  assertThrows 'ParseError', ->
    tokenizer.tokenize ''
  assertThrows 'ParseError', ->
    tokenizer.tokenize '-'
  assertThrows 'ParseError', ->
    tokenizer.tokenize 'x'
  assertThrows 'ParseError', ->
    tokenizer.tokenize '*'
