let budgetController = (() => {

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
        calaculatePercentages = (totalInc) => {
            if (totalInc > 0) {
                this.percentage = Math.round((this.value / totalInc) * 100);
            } else {
                this.percentage = -1;
            }
        }
        getPercentage = () => {
            return this.percentage;
        }
    };

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };


    // recive a type and do the total 
    let calaculateTotal = (type) => {
        let sum = 0;
        // foreach gives a access to index and cur value and complete array
        data.allItems[type].forEach((cur) => {
            //cur.value cuz each array has elem : [id,descri,value]
            sum += cur.value;
        });
        // store the sum to data.total
        data.totals[type] = sum;
    }





    // this is a data structore will help us in the coding process
    let data = {
        allItems: {

            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1, // cuz -1 present something that nonexsiting 

    };
    // make all the function after return public to the other moduals 
    return {
        addItem: (type, des, val) => {
            let newItem, ID;

            // create new id for the constructor Proporty id that stored in the arr inc/exp as an object ex: {id:1,description:rent, valeu:2000}
            if (data.allItems[type].length > 0) {
                // how is .id place down there, buz data.allItems[0,1,2,3 or 19].id, the id is the property of the object exp or inc, that its index [0,1,2,3,4 or 21] 
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // create new element using the constructor function with the type of date inc/exp
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // push// store the new itme inside the data structor inc/exp
            data.allItems[type].push(newItem);

            //retune the new element 
            return newItem;
        },

        deleteItem: (type, id) => {
            let ids, index;


            /// ex:
            // ids = [1,4,7,8,9]
            // the passed id = 8
            // index  = 3


            //map to return new array and use the the current elemnt and index ... 
            ids = data.allItems[type].map((cur) => {
                //this is array of ids 
                return cur.id;
            });
            // here to find the index of the passed id element 
            index = ids.indexOf(id)
                // here will check if there is index and delete the elem from the data 
            if (index !== -1) {
                // splice to delete elem from array
                data.allItems[type].splice(index, 1);
            }
        },

        calaculateBudegt: () => {

            // calculate total inc and exp ---
            //--- we gonna do this function twice for inc and exp so, i will create a private function either recive inc or exp
            calaculateTotal('exp');
            calaculateTotal('inc');


            //calc the budegt: inc - exp and store it in budget
            data.budget = data.totals.inc - data.totals.exp;

            // calc the percentage of inc and exp 
            if (data.totals.inc != 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
        },


        // for the each element in the ADDED itemList
        calaculatePercentages: () => {
            /*
            ///////// EX:
            a=20
            b=30
            c=40
            TOTAL income = 100
            a = 20/100 = 20%
            b = 30/100 = 30%
            c = 40/100 = 40%
            */

            data.allItems.exp.forEach((cur) => {
                cur.calaculatePercentages(data.totals.inc);
            });
        },

        getPercentage: () => {
            let allPerc = data.allItems.exp.map((cur) => {
                return cur.getPercentage()
            });
            return allPerc;
        },




        // retrive budget amount and other and return object 
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,

            }
        },


        // test methods shows the data 
        test: () => {
            console.log(data.allItems);
        }
    }
})();



let UIController = (() => {

    //Obj hold all the DOMs
    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',

    }



    // this will format the number with add +/- sign and add {,} if the number over 1000...
    let formatNumber = (num, type) => {
        let numSplit, int, dec;
        /*
        + or - before the number 
        exactly 2 decimal points 
        comma separating the thousands 
        */

        // return the excate give number formate 
        num = Math.abs(num);

        // toFixed decimal number
        // this is method of the number prototype
        // will add decimal number of 2 
        //ex..... 2000 = 2000.00 another 2 = 2.00   
        num = num.toFixed(2);
        // here will use the comma after the split and return array of strings
        numSplit = num.split('.')

        int = numSplit[0];
        if (int.length > 3) {
            // this allow use to take apart of the string
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length); /// input 2310 output 2,310
        }
        dec = numSplit[1];


        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    // this is usable 
    let nodeListForEach = (list, callback) => {
        for (let i = 0; i < list.length; i++) {
            //list[i] === cur and i = index from the callback function
            callback(list[i], i)
        }
    };


    // public founctions accessable by other MOUDELS
    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                // parseFloat to covert a string to number...
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: (obj, type) => {
            let html, newItem, element;
            if (type === 'inc') {
                // element here used to know which list exp or inc that this new html should go in 
                element = DOMStrings.incomeContainer;
                // this is the new html list will place inside the Container.
                html = `<div class="item clearfix" id="inc-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNumber(obj.value, type)}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button>
                    </div>
                </div>
            </div>`;
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = `<div class="item clearfix" id="exp-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNumber(obj.value, type)}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
            };

            // replace the place holder text that i wrote in the HTML strings
            // newItem = html.replace('%id%', obj.id);
            // newItem = newItem.replace('%description%', obj.description);
            // newItem = newItem.replace('%%value', obj.value);


            // insert the html into the DOM
            // here the element is identify wither inc/exp by the type above then insert html(newItem) beforeend 
            document.querySelector(element).insertAdjacentHTML('beforeend', html)
        },

        // delete item from the dom (SelectedID) passed from target id
        deleteListItem: (SelectedID) => {
            // using the (removeChild) 
            // but here it weired 
            // why : cuz we can't delete element directly but a parant
            // so we identify the ele and we go to its parant than delete its child
            let el = document.getElementById(SelectedID);
            el.parentNode.removeChild(el);
        },

        // clear the fields 
        clearFields: () => {


            let fields;
            fields = document.querySelectorAll(`${DOMStrings.inputDescription},${DOMStrings.inputValue}`);
            //now fields is nodeList, so we need to convert it to array
            fieldsArr = Array.from(fields);
            // now we need to loop over this array so we can clear each field
            fieldsArr.forEach(cur => {
                cur.value = '';
            });
            // set the selector option to + (might be annoying in somepoint)

            // return the foucs to the description input
            fieldsArr[0].focus();


        },
        //this obj = getBudget 
        displayBudget: (obj) => {
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';

            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';

            }
        },

        // the aurgemnt taken from 
        displayPercentages: (percantages) => {
            // where we gonna display the percentages 
            //item percantages from the html which is a NODE list 
            let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            //here creates forEach function for NodeList 
            // using a call back function and passing function like a varible 
            // list here is the nodelist === fields 


            // this is iteration for the items percentage
            nodeListForEach(fields, (cur, index) => {
                if (percantages[index] > 0) {
                    cur.textContent = percantages[index] + '%';
                } else {
                    cur.textContent = '---';
                }
            });
        },

        displayMonth: () => {
            let now, year, month;
            now = new Date();
            year = now.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'];
            month = months[now.getMonth()];
            day = now.getDay();
            document.querySelector(DOMStrings.dateLabel).textContent = `${day}th, ${month}, ${year}`;
        },

        chnageType: () => {

            DOMStrings.inputType.textContent = '+';
            let fields = document.querySelectorAll(
                `${DOMStrings.inputType},${DOMStrings.inputDescription},${DOMStrings.inputValue}`
            );


            nodeListForEach(fields, (cur) => {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');

        },



        // get Dom strings function to have access from the other MODULES 
        getDOMstrings: () => {
            return DOMStrings;
        }
    };
})();


let controller = ((budgetCtrl, UICtrl) => {



    let setEventListener = () => {
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', () => {
            ctrlAddItem();
        });
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            };

        });
        // here we using the event delegation/// to track an event that fire inside this element and we passed function ctrDeleteItem
        //instend of add one event listener to all the element that we are interesting in 
        document.querySelector(DOM.container).addEventListener('click', ctrDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.chnageType);

    };

    let updateBudget = () => {

        // 1- calculate the budget

        budgetCtrl.calaculateBudegt();

        // 2- return the budget 
        let budget = budgetController.getBudget();
        // 3- display the budget on the ui
        UIController.displayBudget(budget);
    };


    let updatePercentages = () => {
        // 1- calc percentages
        budgetCtrl.calaculatePercentages();

        // 2- read percentages 
        let percentages = budgetCtrl.getPercentage();

        // 3-update the UI with the new percentages 
        UICtrl.displayPercentages(percentages);
    };

    let ctrlAddItem = () => {

        let input, newItem;
        // 1- get the field input data
        input = UICtrl.getInput();

        // the code below execute only if 
        // isNaN = is not a number,,,,, we need !isNaN = it is number = true
        /// and value bigger than zero
        // and prevent entry has no data must be not empty

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2- add the item to the budget controller 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3- add the item to the ui 
            // the newItem here is Object that will pass to the addListItem and the type 
            UICtrl.addListItem(newItem, input.type);

            // 4. clear fields 
            UICtrl.clearFields();

            // 5- calaculate and update the budget  
            updateBudget();

            // 6- calc and update percantages  
            updatePercentages();
        }
    };



    /// this function passed to event listener
    // to idientify the target element
    //(event) is the object 
    let ctrDeleteItem = (event) => {
        let itemID, splitID, type, ID;



        // event.target-- to identify the target element with the class name and return its id 
        itemID = event.target.closest('.item').id;
        // console.log(itemID)


        if (itemID) {
            //inc-id / exp-id
            splitID = itemID.split('-');
            //return array inc/exp,
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1- delete item from data strcuter 
            budgetCtrl.deleteItem(type, ID);

            //2- delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //3- update the and show the new budget 
            updateBudget();

            // 7- calc and update percantages  
            updatePercentages();
        }

    }


    return {

        // this return to set an initialization function start the program and set everything up
        init: () => {
            console.log('Application starts')
            UIController.displayMonth();
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });
            setEventListener();

            document.querySelector('.add__type').value = document.querySelector('.opInc').value;
        }
    }

})(budgetController, UIController);


// fire and only the initialization founction here; to start the program
controller.init();