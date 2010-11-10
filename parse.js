(function() {
  var accepting_states, add_transitions, s, states, transitions, _i, _len;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  states = ["start", "atom", "<", "<-", "<->", "-", "->", "~", "^", "v", "(", ")"];
  accepting_states = ["atom", "<->", "->", "~", "^", "v", "(", ")"];
  transitions = {};
  for (_i = 0, _len = states.length; _i < _len; _i++) {
    s = states[_i];
    transitions[s] = {};
  }
  add_transitions = function(start, chars, end) {
    var c, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = chars.length; _i < _len; _i++) {
      c = chars[_i];
      _results.push(transitions[start][c] = end);
    }
    return _results;
  };
  add_transitions("start", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "atom");
  add_transitions("start", "~", "~");
  add_transitions("start", "^", "^");
  add_transitions("start", "v", "v");
  add_transitions("start", "(", "(");
  add_transitions("start", ")", "v");
  add_transitions("start", "<", "<");
  add_transitions("<", "-", "<-");
  add_transitions("<-", ">", "<->");
  add_transitions("start", "-", "-");
  add_transitions("-", ">", "->");
  window.getTokens = function(input) {
    var c, curstate, curtok, tokenQueue, _i, _len;
    tokenQueue = [];
    curtok = "";
    curstate = "start";
    for (_i = 0, _len = input.length; _i < _len; _i++) {
      c = input[_i];
      if (transitions[curstate][c] != null) {
        curstate = transitions[curstate][c];
        curtok += c;
      } else if (transitions["start"][c] != null) {
        if (__indexOf.call(accepting_states, curstate) < 0) {
          throw "ParseError";
        }
        tokenQueue.push(curtok);
        curstate = transitions["start"][c];
        curtok = c;
      } else {
        throw "ParseError";
      }
    }
    if (__indexOf.call(accepting_states, curstate) < 0) {
      throw "ParseError";
    } else {
      tokenQueue.push(curtok);
    }
    return tokenQueue;
  };
}).call(this);
