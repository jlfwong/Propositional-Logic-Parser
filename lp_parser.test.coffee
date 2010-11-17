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
    "~~~~~~~~~A"
  ]

  for trial in trials
    ok(parser.parse(tokenizer.tokenize(trial)),trial)
