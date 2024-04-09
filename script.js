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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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
  const currentUser = accounts.find(
    acct => acct.username === user && acct.pin === +pin
  );
  return {
    login: currentUser ? true : false,
    currentUser,
  };
}

// 3 calculate balance
function calculateBalance(){
  accounts.forEach(
    (acct)=>{
    Object.assign(acct, {
      currentBalance: acct.movements.reduce(
        (ac, movement) => (ac += movement),
        0
      ),
    });
  })
}

// 4 Update UI
function updateUI(currentUser) {
  // display current balance
  labelBalance.textContent = currentUser.currentBalance
  // display summary
  labelSumIn.textContent = currentUser.movements.filter(movement => movement > 0).reduce((ac,movement)=>ac+=movement,0)
  labelSumOut.textContent = Math.abs(currentUser.movements.filter(movement => movement < 0).reduce((ac,movement)=>ac+=movement,0))
  // display movements
  currentUser.movements.forEach((movement,idx)=>{
    
    containerMovements.insertAdjacentHTML("afterbegin",createMovementHtml(movement,idx))
  })

}

//create html movement
function createMovementHtml(movement,idx) {
  const type = movement > 0 ? 'deposit' : 'withdrawal';
 return `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
    idx + 1
  } ${type}</div>
          <div class="movements__value">${movement}€</div>
        </div>`
}


//Events handle
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const loginUsername = inputLoginUsername.value;
  const loginPin = inputLoginPin.value;
  const authenticationObject = checkCreadentials(loginUsername, loginPin);
  inputLoginUsername.value = ''
  inputLoginPin.value = ''
  inputLoginPin.blur()
  if (authenticationObject.login) {
    const {currentUser} = authenticationObject
    labelWelcome.textContent = `Welcome ${currentUser.owner.split(' ')[1]}`
    labelWelcome.textContent = `Welcome ${currentUser.owner}`
    containerApp.style.opacity = 100;
    updateUI(currentUser)  
  }
});

// Function global calls
createUsername(accounts);
calculateBalance(accounts);