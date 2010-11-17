module 'LPParser'

assertThrows = (error,fcn) ->
  correctError = false
  try
    fcn()
  catch e
    correctError = (error == e)
  ok correctError

test 'valid', ->
  parser = new LPParser
  tokenizer = new LPTokenizer

  trials = [
    "A^(BvC)",
    "A->B",
    "A<->B",
    "A^B^C",
    "AvB",
    "AvBvC",
    "Av(B^C)vD",
    "A^B",
    "A",
    "((((A))))",
    "~A",
    "~~~~~~~~~A",
    "~A<->~B->~C^~Dv~E"
  ]

  for trial in trials
    ok(parser.parse(tokenizer.tokenize(trial)),trial)

test 'errors', ->
  parser = new LPParser
  tokenizer = new LPTokenizer

  trials = [
    "",
    "^",
    "v",
    "(",
    "(((",
    "((())",
    ")",
    ")(",
    "~",
    "AA",
    "->",
    "<->",
    "A->->B",
    "A<-><->B",
  ]

  for trial in trials
    assertThrows "ParseError", ->
      parser.parse(tokenizer.tokenize(trial))
