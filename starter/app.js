var budgetController = (function() {
  // Some code
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round(this.value / totalIncome * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    },
    budget: 0,
    percentage: -1
  }

  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      // Create new ID
      //console.log(data.allItems[type].length);
      if (data.allItems[type].length > 0) {
          ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else { ID = 0; }

      // Create new item based on 'inc' or 'exp'
      if (type === 'expense') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'income') {
        newItem = new Income(ID, des, val);
      }
      // Push it into the data structure
      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function(type, id) {
      var ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        // Remove items of that index
        data.allItems[type]. splice(index, 1);
      }

    },

    calculateBudget: function() {
      // Caclculate total income and expenses
      calculateTotal('expense');
      calculateTotal('income');
      // Calculate the budget = income - expenses
      data.budget = data.totals.income - data.totals.expense;
      // Calculate the percentage of income ie. expense / income
      if (data.totals.income > 0) {
          data.percentage = Math.round(data.totals.expense / data.totals.income * 100);
          //data.allItems.expense.forEach(function(cur, index) {
            //data.itemPercentage[index] = Math.round(cur / data.totals.income);
          //});
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentage: function() {
      data.allItems.expense.forEach(function(cur) {
        cur.calcPercentage(data.totals.income);
      });
    },

    getPercentage: function() {
      var allPerc = data.allItems.expense.map(function(cur) {
        return cur.getPercentage();
    });
    return allPerc;
  },

    getBudget: function() {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalInc: data.totals.income,
        totalExp: data.totals.expense,
        itemPercentage: data.itemPercentage
      };
    },

    testing: function() {
      console.log(data);

    }
  };
})();



/////////////////////
var UIController = (function() {
  // Some code
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    itemPercentageLabel: '.item__percentage',
    containerLabel: '.container',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function(num, type) {
    var numSplit, int, dec;
    num = Math.abs(num);
    num = num.toFixed(2);
    // Split number into integer and decimal
    numSplit = num.split('.');
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.lengh-3) + ',' + int.substr(int.lengh-3, 3);
    }
    dec = numSplit[1];

    return (type === 'expense'? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
  };

  var nodeListForEach = function(list, callback) {
    for (var i=0; i<list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      var html, newHtml;
      // Create html string with placeholder text
      if (type === 'income') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id"><div class="item__description">%description</div><div class="right clearfix"><div class="item__value">%value</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'expense') {
        element = DOMstrings.expensesContainer;
        html = '  <div class="item clearfix" id="expense-%id"><div class="item__description">%description</div><div class="right clearfix"><div class="item__value">%value</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // Replace the placeholder text with some actual dataLabel
      newHtml = html.replace('%id', obj.id);
      newHtml = newHtml.replace('%description', obj.description);
      newHtml = newHtml.replace('%value', formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },



    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription +
        ',' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      // Update budget
      // console.log(obj.totalInc);
      obj.budget >= 0 ? type = 'income' : type = 'expense';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      // Update total income
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'income');
      // Update total expenses
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'expense');

      if (obj.percentage >= 0) {
        // Update the percentage
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        //document.querySelector(DOMstrings.itemPercentageLabel).textContent = obj.itemPercentage;

      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '----';
        //document.querySelector(DOMstrings.itemPercentageLabel).textContent = '--';
        }
    },

    displayPercentage: function(percentages) {
      // Create a nodeList
      var fields = document.querySelectorAll(DOMstrings.itemPercentageLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }

      });
    },

    displayMonth: function() {
      var now, year, month, months;

      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
      'Nov', 'Dec'];
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();

      document.querySelector(DOMstrings.dateLabel).textContent = months[month - 1] + ', ' + year;
    },

    changeType: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' +
      DOMstrings.inputValue);
      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

///////////////////
// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event) {
      // KeyCode = 13 for 'Enter'
      if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
        }
      });
    document.querySelector(DOM.containerLabel).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType());
    };


  var updateBudget = function() {
    var budget;
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    budget = budgetCtrl.getBudget();
    //console.log(budget);

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);

  };

  var updatePercentages = function() {
    var percentage;
    // 1. Calculate percentages
    budgetCtrl.calculatePercentage();

    // 2. Read percentage from the budget controller
    percentage = budgetCtrl.getPercentage();

    // 3. Update the UI with the new percentage
    UICtrl.displayPercentage(percentage);
  }

  var ctrlAddItem = function () {
      var input, newItem;
      // 1. Get the field input data
      input = UICtrl.getInput();

      if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
        // 2. Add the item to the budget CONTROLLER
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //console.log(newItem);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        // 4. Clear the fields
        UICtrl.clearFields();
        // 5. Calculate and update budget
        updateBudget();
        // 6. Update the item percentage;
        updatePercentages();
      }
    };

    var ctrlDeleteItem = function(event) {
      var itemID, splitID, ID, type

      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

      if (itemID) {
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);
        // 1. Delete item from data structure
        budgetCtrl.deleteItem(type, ID);
        // 2. Delete item from UI
        UICtrl.deleteListItem(itemID);
        // 3. Update and show the new budget
        updateBudget();
        // 4. Update the new item percentage
        updatePercentages();
      }

    };

    UICtrl.displayMonth();

  return {
    // Initialization function
    init: function() {
      console.log('Application has statred');
      UICtrl.displayBudget({
        budget: 0,
        percentage: -1,
        totalInc: 0,
        totalExp: 0,
      });
      setupEventListeners();
    }
  };

  })(budgetController, UIController);

//Initialization
controller.init();
