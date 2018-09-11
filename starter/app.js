var budgetController = (function() {
  // Some code
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    }
  }

  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      // Create new ID
      console.log(data.allItems[type].length);
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
    inputBtn: '.add__btn'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    addListItem: function(obj, type) {
      // Create html string with placeholder text
      <div class="item clearfix" id="income-0"><div class="item__description">Salary</div><div
      class="right clearfix"><div class="item__value">+ 2,100.00</div><div
      class="item__delete"><button class="item__delete--btn"><i
      class="ion-ios-close-outline"></i></button></div></div></div>

      // Replace the placeholder text with some actual dataLabel

      // Insert the HTML into the DOM

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
    };

  var ctrlAddItem = function () {
      var input, newItem;
      // 1. Get the field input data
      input = UICtrl.getInput();

      // 2. Add the item to the budget CONTROLLER
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      console.log(newItem);

      // 3. Add the item to the UI

      // 4. Calculate the budget

      // 5. Display the budget on the UI
  };
// Initialization
  return {
    init: function() {
      console.log('Application has statred');
      setupEventListeners();
    }
  };

  })(budgetController, UIController);


  controller.init();
