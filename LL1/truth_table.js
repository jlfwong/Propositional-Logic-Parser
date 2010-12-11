(function() {
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __hasProp = Object.prototype.hasOwnProperty;
  $(document).ready(function() {
    var evaluator, generateTruthTable, getAllValuations, getAtomList, parser;
    evaluator = new LPEvaluator;
    parser = new LPParser;
    getAtomList = function(formula) {
      var atoms, cur_node, node, node_stack, parse_root, symbol, _ref, _ref2;
      parse_root = parser.parse(formula);
      atoms = [];
      node_stack = [parse_root];
      while (node_stack.length > 0) {
        cur_node = node_stack[node_stack.length - 1];
        node_stack.pop();
        if (cur_node.terminal) {
          if (cur_node.symbol === 'atom' && (_ref = cur_node.literal, __indexOf.call(atoms, _ref) < 0)) {
            atoms.push(cur_node.literal);
          }
        } else {
          for (symbol in _ref2 = cur_node.expansions) {
            if (!__hasProp.call(_ref2, symbol)) continue;
            node = _ref2[symbol];
            node_stack.push(node);
          }
        }
      }
      return atoms.sort();
    };
    getAllValuations = function(atom_list) {
      var cur_named_val, cur_valuation, i, named_valuations, partial_val_stack, val, valuations, _i, _len;
      valuations = [];
      partial_val_stack = [[]];
      while (partial_val_stack.length > 0) {
        cur_valuation = partial_val_stack[partial_val_stack.length - 1];
        partial_val_stack.pop();
        if (cur_valuation.length === atom_list.length) {
          valuations.push(cur_valuation);
        } else {
          partial_val_stack.push(cur_valuation.concat([true]));
          partial_val_stack.push(cur_valuation.concat([false]));
        }
      }
      named_valuations = [];
      for (_i = 0, _len = valuations.length; _i < _len; _i++) {
        val = valuations[_i];
        cur_named_val = {};
        i = 0;
        while (i !== atom_list.length) {
          cur_named_val[atom_list[i]] = val[i];
          i += 1;
        }
        named_valuations.push(cur_named_val);
      }
      return named_valuations;
    };
    generateTruthTable = function(formula) {
      var all_valuations, atom, atom_list, first_tr, formula_value, row_tr, table, val, _i, _j, _k, _len, _len2, _len3, _results;
      atom_list = getAtomList(formula);
      $('#display').html('');
      table = $('<table/>', {
        id: 'of_truth'
      }).appendTo('#display');
      first_tr = $('<tr/>').appendTo(table);
      for (_i = 0, _len = atom_list.length; _i < _len; _i++) {
        atom = atom_list[_i];
        first_tr.append($('<th/>').text(atom));
      }
      first_tr.append($('<th/>').text(formula));
      all_valuations = getAllValuations(atom_list);
      _results = [];
      for (_j = 0, _len2 = all_valuations.length; _j < _len2; _j++) {
        val = all_valuations[_j];
        row_tr = $('<tr/>').appendTo(table);
        for (_k = 0, _len3 = atom_list.length; _k < _len3; _k++) {
          atom = atom_list[_k];
          $('<td/>').text(val[atom] ? 1 : 0).appendTo(row_tr);
        }
        formula_value = evaluator.evaluate(formula, val);
        _results.push($('<td/>').text(formula_value ? 1 : 0).appendTo(row_tr));
      }
      return _results;
    };
    $('#formula').val('(A->AvB)->B^C<->~A^C').keyup(function(e) {
      var formula, valid;
      valid = true;
      formula = $(this).val();
      try {
        parser.parse(formula);
      } catch (e) {
        valid = false;
      } finally {
        $(this).attr('class', valid ? 'valid' : 'invalid');
      }
      if (valid) {
        return generateTruthTable(formula);
      } else {
        return $('#display').html('');
      }
    });
    return $('#formula').focus().keyup();
  });
}).call(this);
