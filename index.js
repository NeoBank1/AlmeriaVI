var defaultBalance = 708000;
var legacyDefaultBalance = 925374.21;
var previousDefaultBalance = 688000;

function formatCurrency(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getStoredBalance() {
  var savedBalance = localStorage.getItem('balance');
  var balance = parseFloat(savedBalance);

  if (
    !savedBalance ||
    isNaN(balance) ||
    balance === legacyDefaultBalance ||
    (balance === previousDefaultBalance && getStoredTransactions().length === 0)
  ) {
    balance = defaultBalance;
    localStorage.setItem('balance', balance);
  }

  return balance;
}

function setBalanceText(element, balance, includeLabel) {
  if (!element) {
    return;
  }

  element.textContent = (includeLabel ? 'Available balance: ' : '') + '$' + formatCurrency(balance);
}

function getStoredTransactions() {
  try {
    return JSON.parse(localStorage.getItem('transactions')) || [];
  } catch (error) {
    return [];
  }
}

function saveTransaction(transaction) {
  var transactions = getStoredTransactions();

  transactions.unshift(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function renderTransactionHistory() {
  var historyElement = document.getElementById('dynamic-transactions');

  if (!historyElement) {
    return;
  }

  historyElement.innerHTML = '';

  getStoredTransactions().forEach(function(transaction) {
    var transactionElement = document.createElement('div');
    transactionElement.className = 'transaction';

    var amountClass = transaction.amount < 0 ? 'negative' : 'positive';
    var amountSign = transaction.amount < 0 ? '-' : '+';

    transactionElement.innerHTML =
      '<span class="date">Date: ' + transaction.date + '</span>' +
      '<span class="description">Description: ' + transaction.description + '</span>' +
      '<span class="amount ' + amountClass + '"><span style="color: white;">Amount:</span> ' +
      amountSign + '$' + formatCurrency(Math.abs(transaction.amount)) + '</span>' +
      '<span class="balance">Balance: $' + formatCurrency(transaction.balance) + '</span>';

    historyElement.appendChild(transactionElement);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var balanceElement = document.getElementById('balance');
  var dashboardBalanceElement = document.getElementById('dashboard-balance');
  var balance = getStoredBalance();

  setBalanceText(balanceElement, balance, true);
  setBalanceText(dashboardBalanceElement, balance, false);
  renderTransactionHistory();
});

var continueButton = document.getElementById('continue-button');

if (continueButton) {
  continueButton.addEventListener('click', function() {
    var balanceElement = document.getElementById('balance');
    var amountInput = document.getElementById('amount-input');
    var messageElement = document.getElementById('error-message');

    var balanceText = balanceElement.textContent;
    var balance = parseFloat(balanceText.replace(/[^\d.-]/g, ''));
    var amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      messageElement.textContent = 'Please enter a valid amount.';
      messageElement.style.display = 'block';
      messageElement.style.color = 'red';
      return;
    }

    if (amount > balance) {
      messageElement.textContent = 'Insufficient balance.';
      messageElement.style.display = 'block';
      messageElement.style.color = 'red';
    } else {
      balance -= amount; // Deduct amount from balance

      setBalanceText(balanceElement, balance, true);
      localStorage.setItem('balance', balance); // Save the new balance to localStorage
      saveTransaction({
        date: new Date().toISOString().slice(0, 10),
        description: 'Wire Transfer Out',
        amount: -amount,
        balance: balance
      });

      messageElement.textContent = 'Transfer successful!';
      messageElement.style.display = 'block';
      messageElement.style.color = 'green';

      amountInput.value = ''; // Reset input value
    }
  });
}
