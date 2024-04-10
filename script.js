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
        .join('')
    });
  });
}

// 2 check credentials and get current user
function checkCreadentials(user, pin) {
  const currentUser = getUser(user)
  return {
    login: (currentUser && currentUser.pin === +pin) ? true : false,
    currentUser,
  };
}

// get user 
function getUser(user) {
  return accounts.find(acct => acct.username === user)
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
  inputLoginUsername.style.borderColor = inputLoginPin.style.borderColor = 'white'
  if (authenticationObject.login) {
    currentUser = authenticationObject['currentUser'];
    labelWelcome.textContent = `Welcome ${currentUser.owner.split(' ')[1]}`
    labelWelcome.textContent = `Welcome ${currentUser.owner}`
    containerApp.style.opacity = 100;
    updateUI(currentUser)  
  }
  else{
    inputLoginUsername.style.borderColor = inputLoginPin.style.borderColor = 'red'
  }
});

// transfer money
btnTransfer.addEventListener('click',(e)=>{
  e.preventDefault();
  const transferAmount = +inputTransferAmount.value
  const transferToUser = getUser(inputTransferTo.value)
  inputTransferAmount.value = ""
  inputTransferTo.value = ""
  inputTransferTo.blur()
  if(transferToUser && transferToUser !== currentUser && currentUser.currentBalance >= transferAmount){
    // console.log(transferToUser,transferAmount)
    currentUser.currentBalance -= transferAmount
    transferToUser.movements.push(transferAmount)
    transferToUser.currentBalance += transferAmount
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      createMovementHtml(-transferAmount,currentUser.movements.length)
      );
      currentUser.movements.push(-transferAmount)
    labelBalance.textContent = currentUser.currentBalance
    
  }
  else{
    console.log("Something went wrong")
  }
})

function verificationForLoan(movements,requestAmount){
  return movements.some((movement)=>movement > requestAmount/10)
}

//request loan
btnLoan.addEventListener('click',(e)=>{
  e.preventDefault()
  const requestAmount = +inputLoanAmount.value
  if(requestAmount > 0 && verificationForLoan(currentUser.movements,requestAmount)){
    currentUser.currentBalance+=requestAmount
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      createMovementHtml(requestAmount,currentUser.movements.length)
      );
      currentUser.movements.push(requestAmount)
    labelBalance.textContent = currentUser.currentBalance
  }
})

// Function global calls
inputLoginUsername.focus();
let currentUser = account1
createUsername(accounts);
calculateBalance(accounts);
