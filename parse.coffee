states = [
  "start",
  "atom",
  "<",
  "<-",
  "<->",
  "-",
  "->",
  "~",
  "^",
  "v",
  "(",
  ")"
]

accepting_states = [
  "atom",
  "<->",
  "->",
  "~",
  "^",
  "v",
  "(",
  ")"
]

transitions = {}

for s in states
  transitions[s] = {}

add_transitions = (start,chars,end) ->
  for c in chars
    transitions[start][c] = end

add_transitions "start", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "atom"

add_transitions "start", "~", "~"
add_transitions "start", "^", "^"
add_transitions "start", "v", "v"
add_transitions "start", "(", "("
add_transitions "start", ")", "v"

add_transitions "start", "<", "<"
add_transitions "<",     "-", "<-"
add_transitions "<-",    ">", "<->"

add_transitions "start", "-", "-"
add_transitions "-",     ">", "->"

window.getTokens = (input) ->
  tokenQueue = []
  curtok = ""
  curstate = "start"
  for c in input
    if transitions[curstate][c]?
      curstate = transitions[curstate][c]
      curtok += c
    else if transitions["start"][c]?
      if curstate not in accepting_states
        throw "ParseError"
      tokenQueue.push(curtok)
      curstate = transitions["start"][c]
      curtok = c
    else
      throw "ParseError"
  if curstate not in accepting_states
    throw "ParseError"
  else
    tokenQueue.push(curtok)
  tokenQueue
