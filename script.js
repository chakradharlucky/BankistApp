'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Lakinana Chakradhar', //Jonas Schmedtmann
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
  ],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// functions
// 1 Create username
function createUsername(accounts) {
  accounts.forEach(function (acct) {
    Object.assign(acct, {
      username: acct.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''),
    });
  });
}

// 2 check credentials and get current user
function checkCreadentials(user, pin) {
  const currentUser = getUser(user);
  return {
    login: currentUser && currentUser.pin === +pin ? true : false,
    currentUser,
  };
}

// get user
function getUser(user) {
  return accounts.find(acct => acct.username === user);
}

// 3 calculate balance
function calculateBalance() {
  accounts.forEach(acct => {
    Object.assign(acct, {
      currentBalance: acct.movements.reduce(
        (ac, movement) => (ac += movement),
        0
      ),
    });
  });
}

// 4 Update UI
function updateUI(currentUser) {
  // display current balance
  labelBalance.textContent = currentUser.currentBalance;
  // display summary
  labelSumIn.textContent = currentUser.movements
    .filter(movement => movement > 0)
    .reduce((ac, movement) => (ac += movement), 0);
  labelSumOut.textContent = Math.abs(
    currentUser.movements
      .filter(movement => movement < 0)
      .reduce((ac, movement) => (ac += movement), 0)
  );
  // display movements
  currentUser.movements.forEach((movement, idx) => {
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      createMovementHtml(movement, idx, currentUser.movementsDates[idx])
    );
  });
}

//create html movement
function createMovementHtml(movement, idx, date) {
  const type = movement > 0 ? 'deposit' : 'withdrawal';
  return `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${idx + 1} ${type}</div>
  <div class="movements__date">${dateFormate(new Date(date))}</div>
  <div class="movements__value">${movement}€</div>
  </div>`;
}

//date
function dateFormate(date) {
  // const dateDay = date.getDate() + '';
  // const month = date.getMonth() + 1 + '';
  // const year = date.getFullYear() + '';
  // return `${dateDay.padStart(2, 0)}/${month.padStart(2, 0)}/${year}`;
  return Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    year: 'numeric',
    month: '2-digit',
  }).format(date);
  
}

//Events handle
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const loginUsername = inputLoginUsername.value;
  const loginPin = inputLoginPin.value;
  const authenticationObject = checkCreadentials(loginUsername, loginPin);
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginPin.blur();
  inputLoginUsername.style.borderColor = inputLoginPin.style.borderColor =
    'white';
  if (authenticationObject.login) {
    currentUser = authenticationObject['currentUser'];
    labelWelcome.textContent = `Welcome ${currentUser.owner}`;
    containerApp.style.opacity = 100;
    updateUI(currentUser);
    labelDate.textContent = new Date().toDateString();
  } else {
    inputLoginUsername.style.borderColor = inputLoginPin.style.borderColor =
      'red';
  }
});

// transfer money
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const transferAmount = +inputTransferAmount.value;
  const transferToUser = getUser(inputTransferTo.value);
  const date = new Date().toISOString();
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferTo.blur();
  if (
    transferToUser &&
    transferToUser !== currentUser &&
    currentUser.currentBalance >= transferAmount
  ) {
    currentUser.currentBalance -= transferAmount;
    transferToUser.movements.push(transferAmount);
    transferToUser.currentBalance += transferAmount;
    transferToUser.movementsDates.push(date);
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      createMovementHtml(
        -transferAmount,
        currentUser.movements.length,
        date
      )
    );
    currentUser.movements.push(-transferAmount);
    currentUser.movementsDates.push(date);
    labelBalance.textContent = currentUser.currentBalance;
  } else {
    console.log('Something went wrong');
  }
});

function verificationForLoan(movements, requestAmount) {
  return movements.some(movement => movement > requestAmount / 10);
}

//request loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const requestAmount = +inputLoanAmount.value;
  if (
    requestAmount > 0 &&
    verificationForLoan(currentUser.movements, requestAmount)
  ) {
    currentUser.currentBalance += requestAmount;
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      createMovementHtml(requestAmount, currentUser.movements.length,new Date().toISOString())
    );
    currentUser.movementsDates.push(new Date().toISOString());
    currentUser.movements.push(requestAmount);
    labelBalance.textContent = currentUser.currentBalance;
  }
});

//close account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    currentUser.username === inputCloseUsername.value &&
    currentUser.pin === +inputClosePin.value
  ) {
    inputClosePin.value = '';
    inputCloseUsername.value = '';
    inputClosePin.blur();
    accounts.splice(accounts.indexOf(currentUser), 1);
    currentUser = null;
    labelWelcome.textContent = 'Log in to get started';
  }
});

// Function global calls
inputLoginUsername.focus();
let currentUser
createUsername(accounts);
calculateBalance(accounts);