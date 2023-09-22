"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);





// ----------- DISPLAY MOVEMENTS DEPOSIT AND WITHDREW --------------------------
// --- SORT movements ( sort = false) - added at the end ----

const displayMovements = function (movements, sort = false) {
  // take out default movements
  containerMovements.innerHTML = "";

  // --- SORTING MOVEMENTS
  // use .slice to make a copy or the array
  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements
  // calling function right at the end

  // before sorting method, movs = movements
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov} €</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};


//----------------------------DISPLAY BALANCE-----------------------------------

// const calcDisplayBalance = function (movements) {
//   const balance = movements.reduce((acc, mov) => acc + mov, 0)
//   labelBalance.textContent = `${balance} €`
// }

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`
}


//----------------------------DISPLAY SUMMARY-----------------------------------

// const calcDisplaySummary = movements
//   .filter(function (mov) {
//     return mov > 0;
//   })
//   .reduce(function (acc, mov){
//     return labelSumIn.textContent = acc + mov
//   }, 0)
// calcDisplayBalance(movements)

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc = acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, inc) => acc + inc, 0);
  labelSumInterest.textContent = `${interest}€`
}


// --------------------------CREATING USERNAMES---------------------------------

// MAP METHOD - creates new array
// create usernames => "Steven Thomas Williams"  =  stw
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
}

createUsernames(accounts)
// console.log(accounts);

// --------------------  LOGIN FUNCTION ----------------------------------------
// we will need the info of current account for later, just define it
const updateUI = function (acc) {
    // display movements
    displayMovements(acc.movements);

    // display balance
    calcDisplayBalance(acc);

    // display summary
    calcDisplaySummary(acc);
}

let currentAccount;

// create event handler
btnLogin.addEventListener('click', function(e) {
  // prevent submit form reload the page
  e.preventDefault();

  // find the account that the user inputed
  currentAccount = accounts.find(function (acc) {
    // we need to read the input value (.value)
    // created username in creating usernames function
    return acc.username === inputLoginUsername.value
  })
  // console.log(currentAccount);

  // we found the account, now lets check if it is the correct pin
  // currentaccount exist ?
  // if we dont check if exists and it doesnt, system shows an error
  if (currentAccount?.pin === Number (inputLoginPin.value)) {
    // change welcome message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`

    // display page
    containerApp.style.opacity = 100;

    // clear login and pin input fields
    // clear focus
    inputLoginUsername.value = inputLoginPin.value = ' '
    inputLoginPin.blur()

    // updated UI
    updateUI(currentAccount)
  }

})


// -------------------- TRANSFER MONEY -----------------------------------------


btnTransfer.addEventListener('click', function(e) {
  e.preventDefault()

  const amount = Number(inputTransferAmount.value);

  const receiverAcc = accounts
  .find (acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur()


  // only transfer if : balance > 0, enough money, is not yourself
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount)

    // update UI
    updateUI(currentAccount)
  }
})


//------------------------ LOAN ------------------------------------------------
// bank only grants a loan if there is at least one deposit with at least 10% of requested loan amount
btnLoan.addEventListener('click', function(e) {
  e.preventDefault()

  const amount = Number(inputLoanAmount.value)

  // if at least one of the elements is 10% higher than a deposit
  if (amount > 0 && currentAccount.movements.some(mov =>
    mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount)

    // update UI
    updateUI(currentAccount)
  }
  inputLoanAmount.value = ''
  inputLoanAmount.blur()
})

// -------------------- CLOSE ACCOUNT ----------------------------------------
// deletes de object from the accounts array
btnClose.addEventListener('click', function (e) {
  e.preventDefault()

  // check if user and pin are corrects

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // FINDINDEX METHOD finds index with condition given
    // calculate index we want to delete
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    // console.log(index);

    // delete current account
    accounts.splice(index, 1)

    // hide UI
    containerApp.style.opacity = 0
  }
  inputCloseUsername.value = inputClosePin.value = '';

})

// to click again to keep sorting it
let sorted = false;
//add event to button
btnSort.addEventListener('click', function(e) {
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted;
})



/////////////////////////////// LECTURE ////////////////////////////////////////
const movements2 = [200, 450, -400, 3000, -650, -130, 70, 1300];

// -------------------- WORKING BALANCE ----------------------------------------

// FILTER METHOD - returns new array
// to filter for elements that satisfy a certain condition
// we want to create an array od the deposits (movements > 0)
// only the values that pass that condition (true) will be in the new array

const deposits = movements2.filter(function (mov) {
  return mov > 0;
});
// console.log(deposits);

const withdrawals = movements2.filter(mov => mov < 0);
// console.log(withdrawals);


// REDUCE METHOD
// to boil down all the elements in an array to one single value
// reduce function (acumulator, current value, index, array))
// acumulater: acumulates de value we want to return, like snowball.
// need to add the current value to the acumulator
// Add the 0 at the end, to start the acumulator from zero
//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const balance = movements2.reduce(function(acc, cur, i, arr) {
  return acc + cur
}, 0);
// console.log(balance);

// geting maximum value from movements with reduce method
const maximum = movements2.reduce(function(acc, mov) {
  return (acc > mov ? acc : mov)
}, movements2[0])
// console.log(maximum);

//--------------------TOTAL DEPOSITS EURO TO USD --------------------------
// chaining map, reduce and filter methods
const eurToUsd = 1.1;
const totalDepositToUsd = movements2
  .filter(function (mov) {
    return mov > 0;
  })
  .map(function (mov) {
    return mov * eurToUsd;
  })
  .reduce(function (acc, mov) {
    return acc + mov
  }, 0);
// console.log(totalDepositToUsd);


//--------------------  FIND METHOD  -------------------------------------------
// FIND METHOD - does not return a new array, just the element itself
// to retrieve one element of an array based o a condition
// accepts a condition
// needs callback function that return a boolean
// returns first element of array that satifies condition


const firstWithdrawal = movements2.find(function (mov) {
  return mov < 0
})
// console.log(firstWithdrawal); // = -400

// can also find objects
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account); // = {owner: 'Jessica Davis', movements: Array(8), interestRate: 1.5, pin: 2222, username: 'jd'}


//--------------------   SOME METHOD  ------------------------------------------
// .includes only tests for equality
console.log(movements2.includes(-130)); // true

// .some tests for a condition
// returns a boolean
// check if there is any positive movements in the array
const anyDeposits = movements2.some(mov => mov > 0)

//--------------------   EVERY METHOD  -----------------------------------------
// .every returns true if all the elements in the array satisfy the condition

console.log(movements2.every(mov => mov > 0));  // false


//--------------------   new FLAT METHOD  --------------------------------------
// takes all elements from an array and puts them all together in one big array
// only workd one level deep [array [array]]
const arr = [[1, 2, 3], [4, 5, 6], 7, 8]
console.log(arr.flat()); // = [1, 2, 3, 4, 5, 6, 7, 8]

// add how many levels you want to go deep
const arrDeep = [[1, 2, 3], [4,[5, 6]], 7, 8]
console.log(arrDeep.flat(2)); // [1, 2, 3, 4, 5, 6, 7, 8]

//--------------------   new MAP METHOD  --------------------------------------

const accountMovements = accounts.map(acc => acc.movements)
console.log(accountMovements);
/*
[200, 450, -400, 3000, -650, -130, 70, 1300]
[5000, 3400, -150, -790, -3210, -1000, 8500, -30]
[200, -200, 340, -300, -20, 50, 400, -460]
[430, 1000, 700, 50, 90]
*/
const allMovements = accountMovements.flat()
console.log(allMovements); // [200, 450, -400, 3000, -650, -130, 70, 1300, 5000, 3400, -150, -790, -3210, -1000, 8500, -30, 200, -200, 340, -300, -20, 50, 400, -460, 430, 1000, 700, 50, 90]
const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0)
console.log(overallBalance); // 17840

// chaining all this methods:

// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0)
// console.log(overallBalance);

//--------------------   FLATMAP METHOD --------------------------------------
// combines new flat and new map methos

const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0)
console.log(overallBalance2);


//-------------------- SORTING OUT ARRAYS --------------------------------------
// .SORT - mutates originall array
// by default only works with strings
// use when array ONLY numbers

const owners = ['Marta', 'Eugenia', 'Ana', 'Carlos']
console.log(owners.sort()); // ['Ana', 'Carlos', 'Eugenia', 'Marta']
console.log(owners); // MUTATED ['Ana', 'Carlos', 'Eugenia', 'Marta']


// .sort with numbers:
// give a callback function
// array.sort((a, b) => {})
// array.sort((current_value, next_value) => {})
// return < 0  then  A will be sorted before B (keep order)
// return > 0  then  B, A (switch order)

// ascending order
movements2.sort((a,b) => a - b) // [-650, -400, -130, 70, 200, 450, 1300, 3000]
// same as
movements2.sort((a,b) => {
  if (a > b) return 1;
  if (a < b) return -1;
})
console.log(movements2);

// descending order
movements2.sort((a,b) => b - a) // [3000, 1300, 450, 200, 70, -130, -400, -650]
// same as
movements2.sort((a,b) => {
  if (a > b) return -1;
  if (a < b) return 1;
})
console.log(movements2);


//-------------------- CREATE ARRAYS -------------------------------------------
//when we have the data
// we created it manually
console.log([1, 2, 3, 4, 5, 6]);
// array constructor function
console.log(new Array(1, 2, 3, 4, 5, 6));

// -- FILL METHOD --
// -- generate arrays without defining arrays manually --
const x = new Array(7)
console.log(x); // [empty × 7]
// at the moment we can not use the X array for anything
// the use .fill method = pass a value and it will fill the array with specific value
// mutates the array
x.fill(1)  // [1, 1, 1, 1, 1, 1, 1]

// fill(element, index_where_to_start)
x.fill(1, 3) // [empty × 3, 1, 1, 1, 1]
x.fill(1, 3, 5) // [empty × 3, 1, 1, empty x 2]

const arrayFill = [1, 2, 3, 4, 5, 6, 7]
arrayFill.fill(23, 2, 6) // [1, 2, 23, 23, 23, 23, 7]


// -- ARRAY.FROM FUNCTION --
// Array.from()
// Array.from({object_with_length_property}, mapping function)
// mapping function doesnt require arguments
const y = Array.from({ length: 7}, () => 1) // [1, 1, 1, 1, 1, 1, 1]

const z = Array.from({ length: 7}, (cur, i) => i + 1) // [1, 2, 3, 4, 5, 6, 7]


//------------------------ NODE LIST -------------------------------------------
// is a collection of DOM nodes. NodeList objects are returned by `querySelector` and `childNodes`
// they are not arrays. They are stored in the user interface, they are not in the code
// We need to convert it in an array to work with them

// get the values from the user interface
// const new_array = Array.from(element_to_convert_to_array('value_class'))

const movementsUItest = Array.from(document.querySelectorAll('.movements__value'))
console.log(movementsUItest); // [div.movements__value, div.movements__value]
// we only get the two values that are hard coded in the html code, not the movementes in the object. we need an Event handler

//-- attach event listener anywhere in the html code and then click on it
// create an array with Array.from
// use mapping witn array. to get the right information
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  )
  console.log(movementsUI); // we get the 7 movements
})
