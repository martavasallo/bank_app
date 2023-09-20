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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];



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
displayMovements(account1.movements);

//----------------------------DISPLAY BALANCE-----------------------------------

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = `${balance} €`
}
calcDisplayBalance(account1.movements)

// --------------------------CREATING USERNAMES---------------------------------

// MAP METHOD
// create usernames => "Steven Thomas Williams"  =  stw
// we use map to create a new array
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
console.log(accounts);


// -------------------- WORKING BALANCE ----------------------------------------

// FILTER METHOD
// to filter for elements that satisfy a certain condition
// we want to create an array od the deposits (movements > 0)
// only the values that pass that condition (true) will be in the new array
//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);


// REDUCE METHOD
// to boil down all the elements in an array to one single value
// reduce function (acumulator, current value, index, array))
// acumulater: acumulates de value we want to return, like snowball.
// need to add the current value to the acumulator
// Add the 0 at the end, to start the acumulator from zero
//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const balance = movements.reduce(function(acc, cur, i, arr) {
  return acc + cur
}, 0);
console.log(balance);

// geting maximum value from movements with reduce method
const maximum = movements.reduce(function(acc, mov) {
  return (acc > mov ? acc : mov)
}, movements[0])
console.log(maximum);

//--------------------TOTAL DEPOSITS EURO TO USD --------------------------
// chaining map, reduce and filter methods
const eurToUsd = 1.1;
const totalDepositToUsd = movements
  .filter(function (mov) {
    return mov > 0;
  })
  .map(function (mov) {
    return mov * eurToUsd;
  })
  .reduce(function (acc, mov) {
    return acc + mov
  }, 0);
console.log(totalDepositToUsd);
