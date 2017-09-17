function calculateExpression(){
  var expression = document.getElementById("expression").value;
  var operators = expression.split(" ");
  var radio = document.getElementsByName('radio');
  var notation; // 0 or 1
  for (var i = 0; i < radio.length; i++) {
    if (radio[i].type == "radio" && radio[i].checked) {
      notation = i;
    }
  }
  var stack = [];
  var firstOperand;
  var secondOperand;
  var error = false;
  if (notation == 0) {
    operators = operators.reverse();
  }
  for (var i = 0; i < operators.length; i++) {
    if (!isNaN(operators[i])) {
      stack.push(Number(operators[i]));
    }
    else {
      if (stack.length >= 2) {
        secondOperand = stack.pop();
        firstOperand = stack.pop();
        if (notation == 0) {
          var result = calculate(operators[i], secondOperand, firstOperand);
        }
        else {
          var result = calculate(operators[i], firstOperand, secondOperand);
        }
        stack.push(result);
      }
      else {
        error = true;
      }
    }
  }
  if (stack.length > 1 || error) {
    document.getElementById("result").textContent = "Ошибка";
  }
  else {
    document.getElementById("result").textContent = stack.pop();
    drawGraph(operators);
  }
}

function calculate(operator, firstOperand, secondOperand) {
  switch (operator) {
    case "+":
      return firstOperand + secondOperand;
    case "-":
      return firstOperand - secondOperand;
    case "*":
      return firstOperand * secondOperand;
    case "/":
      return firstOperand / secondOperand;
  }
}

function drawGraph(operators) {
  var GraphCell = function(id, label) {
  	this.id = id;
    this.label = label;
	}
  var nodes = new vis.DataSet();
  var edges = new vis.DataSet();
  var stack = [];
  for (var i = 0; i < operators.length; i++) {
    nodes.add({id: i, label: operators[i]});
    operators[i] = new GraphCell(i, operators[i]);
  }
  for (var i = 0; i < operators.length; i++) {
    if (!isNaN(operators[i].label)) {
      stack.push(operators[i]);
    }
    else {
      var firstChild = stack.pop();
      var secondChild = stack.pop();
      edges.add({from: operators[i].id, to: firstChild.id});
      edges.add({from: operators[i].id, to: secondChild.id});
      stack.push(operators[i]);
  	}
  }
  var container = document.getElementById('graph');
  var data = {nodes: nodes, edges: edges};
  var options = {};
  var network = new vis.Network(container, data, options);
}
