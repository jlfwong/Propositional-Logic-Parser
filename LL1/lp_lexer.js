(function() {
  var LPLexer;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  window.LPLexer = (function() {
    LPLexer = (function() {
      function LPLexer() {
        this.transitions = this.init_transitions();
        return this;
      }
      return LPLexer;
    })();
    LPLexer.prototype.states = ["start", "atom", "<", "<-", "<->", "-", "->", "~", "^", "v", "(", ")", "{", "}", "[", "]", "<", ">", "/", "\\"];
    LPLexer.prototype.accepting_states = ["atom", "<->", "->", "~", "^", "v", "(", ")", "[", "]", "{", "}", "<", ">", "/", "\\"];
    LPLexer.prototype.init_transitions = function() {
      var add_transitions, s, transitions, _i, _len, _ref;
      transitions = {};
      _ref = this.states;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
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
      add_transitions("start", ")", ")");
      add_transitions("start", ">", ">");
      add_transitions("start", "/", "/");
      add_transitions("start", "\\", "\\");
      add_transitions("start", "]", "]");
      add_transitions("start", "[", "[");
      add_transitions("start", "{", "{");
      add_transitions("start", "}", "}");
      add_transitions("start", "<", "<");
      add_transitions("<", "-", "<-");
      add_transitions("<-", ">", "<->");
      add_transitions("start", "-", "-");
      add_transitions("-", ">", "->");
      return transitions;
    };
    LPLexer.prototype.tokenize = function(input) {
      var c, curstate, curtok, tokenQueue, _i, _len;
      tokenQueue = [];
      curtok = "";
      curstate = "start";
      for (_i = 0, _len = input.length; _i < _len; _i++) {
        c = input[_i];
        if (this.transitions[curstate][c] != null) {
          curstate = this.transitions[curstate][c];
          curtok += c;
        } else if (this.transitions["start"][c] != null) {
          if (__indexOf.call(this.accepting_states, curstate) < 0) {
            console.log("NotAccept", curstate);
            throw "LexingError";
          }
          tokenQueue.push({
            type: curstate,
            lexeme: curtok
          });
          curstate = this.transitions["start"][c];
          curtok = c;
        } else {
          console.log("ErrorOn", curstate, c);
          throw "LexingError";
        }
      }
      if (__indexOf.call(this.accepting_states, curstate) < 0) {
        console.log("NotAccepting", curstate);
        throw "LexingError";
      } else {
        tokenQueue.push({
          type: curstate,
          lexeme: curtok
        });
      }
      return tokenQueue;
    };
    return LPLexer;
  })();
}).call(this);
