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
const displayMovements = function (movements) {
  // take out default movements
  containerMovements.innerHTML = "";

  movements.forEach(function (mov, i) {
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



// -------------------- WORKING BALANCE ----------------------------------------

// FILTER METHOD - returns new array
// to filter for elements that satisfy a certain condition
// we want to create an array od the deposits (movements > 0)
// only the values that pass that condition (true) will be in the new array
const movements2 = [200, 450, -400, 3000, -650, -130, 70, 1300];

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


//--------------------   JUST PRACTICE FIND METHOD  ----------------------------
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
