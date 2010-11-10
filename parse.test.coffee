module 'getTokens'

assertThrows = (error,fcn) ->
  correctError = false
  try
    fcn()
  catch e
    console.log "Threw: " + e
    correctError = (error == e)
  ok correctError

test 'valid', ->
  same (getTokens 'A^A'), ['A','^','A']
  same (getTokens 'A->A'), ['A','->','A']
  same (getTokens 'A<->A'), ['A','<->','A']
  same (getTokens '~A'), ['~','A']
  same (getTokens '(A)'), ['(','A',')']

test 'errors', ->
  assertThrows 'ParseError', ->
    getTokens '<'
  assertThrows 'ParseError', ->
    getTokens '<-'
  assertThrows 'ParseError', ->
    getTokens ''
  assertThrows 'ParseError', ->
    getTokens '-'
