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

  trials = [
    '<A^/{BvC}\\>',
    '[A->B]',
    '(A<->B)',
    '</<A^B>\\^C>',
    '{AvB}',
    '{Av/{BvC}\\}',
    '{Av/{/<B^C>\\vD}\\}',
    '<A^B>',
    'A',
    '///A\\\\\\',
    '~A',
    '~~~~~~~~~A',
    '[/(~A<->~B)\\->/{/<~C^~D>\\v~E}\\]',
    '(/<~A^B>\\<->/[A->B]\\)'
  ]

  for trial in trials
    ok(parser.parse(trial),trial)

test 'errors', ->
  parser = new LPParser

  trials = [
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
      parser.parse(trial)
