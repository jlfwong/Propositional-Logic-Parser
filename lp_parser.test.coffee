module 'LPTokenizer'

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

  same(
    parser.getDerivation(
      tokenizer.tokenize "A"
    ),
    ["ASDF"]
  )
