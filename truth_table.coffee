$(document).ready ->
  evaluator = new LPEvaluator
  parser = new LPParser

  getAtomList = (formula) ->
    parse_root = parser.parse formula

    atoms = []
    node_stack = [parse_root]

    while node_stack.length > 0
      cur_node = node_stack[node_stack.length-1]
      node_stack.pop()
      if cur_node.terminal
        if cur_node.symbol == 'atom' and cur_node.literal not in atoms
          atoms.push cur_node.literal
      else
        for symbol,node of cur_node.expansions
          node_stack.push node

    return atoms

  getAllValuations = (atom_list) ->
    valuations = []

    partial_val_stack = [[]]
    while partial_val_stack.length > 0
      cur_valuation = partial_val_stack[partial_val_stack.length-1]
      partial_val_stack.pop()

      if cur_valuation.length == atom_list.length
        valuations.push cur_valuation
      else
        partial_val_stack.push(cur_valuation.concat([true]))
        partial_val_stack.push(cur_valuation.concat([false]))

    named_valuations = []

    for val in valuations
      cur_named_val = {}
      i = 0
      while i != atom_list.length
        cur_named_val[atom_list[i]] = val[i]
        i += 1
      named_valuations.push cur_named_val
    
    return named_valuations

  generateTruthTable = (formula) -> 
    atom_list = getAtomList formula

    $('#display').html('')

    table = $('<table/>',{id: 'of_truth'}).appendTo('#display')
    first_tr = $('<tr/>').appendTo(table)

    for atom in atom_list
      first_tr.append($('<th/>').text(atom))

    first_tr.append($('<th/>').text(formula))

    all_valuations = getAllValuations atom_list
    for val in all_valuations
      row_tr = $('<tr/>').appendTo(table)
      for atom in atom_list
        $('<td/>').text(if val[atom] then 1 else 0).appendTo(row_tr)
      formula_value = evaluator.evaluate(formula,val)
      $('<td/>').text(if formula_value then 1 else 0).appendTo(row_tr)

  $('#formula').val('(A->AvB)->B^C<->~A^C').keyup (e) ->
    valid = true
    formula = $(this).val()
    try
      parser.parse formula
    catch e
      valid = false
    finally
      $(this).attr('class',
        if valid then 'valid' else 'invalid'
      )

    if valid
      generateTruthTable formula
    else
      $('#display').html('')

  $('#formula').focus().keyup()
  
