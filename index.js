document.addEventListener('DOMContentLoaded', function() {
  var savedBalance = localStorage.getItem('balance');
  var balanceElement = document.getElementById('balance');
  
  if (savedBalance) {
    balanceElement.textContent = 'Available balance: $' + parseFloat(savedBalance).toFixed(2);
  } else {
    // Set initial balance and transfer count if not present in localStorage
    localStorage.setItem('balance', 925374.21);
    localStorage.setItem('transferCount', 0);
    balanceElement.textContent = 'Available balance: $925374.21';
  }
});

document.getElementById('continue-button').addEventListener('click', function() {
  var balanceElement = document.getElementById('balance');
  var amountInput = document.getElementById('amount-input');
  var messageElement = document.getElementById('error-message');
  var transferCount = parseInt(localStorage.getItem('transferCount')) || 0;

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
    if (transferCount >= 1) {
      messageElement.textContent = 'Service temporarily unavailable, try again later.';
      messageElement.style.display = 'block';
      messageElement.style.color = 'red';
    } else {
      balance -= amount; // Deduct amount from balance
      transferCount += 1; // Increment transfer count

      balanceElement.textContent = 'Available balance: $' + balance.toFixed(2);
      localStorage.setItem('balance', balance); // Save the new balance to localStorage
      localStorage.setItem('transferCount', transferCount); // Update the transfer count in localStorage

      messageElement.textContent = 'Transfer successful!';
      messageElement.style.display = 'block';
      messageElement.style.color = 'green';

      amountInput.value = ''; // Reset input value
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("paymentModal");
  const btn = document.getElementById("transferLink");
  const span = document.getElementsByClassName("close")[0];
  const confirmPaymentButton = document.getElementById("confirmPayment");

  btn.onclick = function(event) {
      event.preventDefault();
      modal.style.display = "block";
  }

  span.onclick = function() {
      modal.style.display = "none";
  }

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

  confirmPaymentButton.onclick = function() {
      alert("Payment of $800 has been confirmed.");
      window.location.href = btn.href;
  }
});
