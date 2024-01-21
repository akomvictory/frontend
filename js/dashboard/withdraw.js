const user = JSON.parse(localStorage.getItem("user"));
if (user == null) {
  window.location.href = "../signin.html";
}
const _amount = document.getElementById("amount");
let amount = 0;
const api = "https://admin.coinpecko.online/api";
//const api = "http://127.0.0.1:8000/api";
let _token = user.access_token.original.access_token;
let _bank = false;
let _crypto = false;

document.getElementById("bank").onclick = () => {
  _bank = !_bank;
  _crypto = false;
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
};

document.getElementById("crypto").onclick = () => {
  _crypto = !_crypto;
  _bank = false;
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
};

_amount.onchange = (e) => {
  amount = e.currentTarget.value;
};

document.getElementById("register").addEventListener("submit", function (e) {
  e.preventDefault();
});

document.getElementById("submit").onclick = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${api}/account/${user.user.account.id}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
    });

    const result = await response.json();
    if (
      parseInt(amount) >= 200 &&
      amount !== "" &&
      result.data.balance >= amount
    ) {
      setAmount("current_balance", result.data.balance);
      setAmount("request_amount", amount);
      setAmount("charges", (amount * 5) / 100);
      setAmount("receive", amount);
      setAmount("balance", result.data.balance - amount - (amount * 5) / 100);
      setAmount(
        "after_charges",
        parseInt(amount) + parseInt((amount * 5) / 100)
      );

      document.getElementById("submit").setAttribute("data-dismiss", "modal");

      document.getElementById("first").style.display = "none";
      if (_bank) {
        document.getElementById("third").style.display = "block";
      }
      if (_crypto) {
        document.getElementById("second").style.display = "block";
      }
    } else {
      showNotification(false, "Amount must be more than $200");
    }
  } catch (error) {
   
     window.location.href = "../signin.html";
  }
};

document.getElementById("confirmCrypto").onsubmit = (e) => {
  e.preventDefault();
};

document.getElementById("confirmCryptoSubmit").onclick = async (e) => {
  e.preventDefault();

  const data = {
    user_id: user.user.id,
    amount,
    withdrawal_type: "crypto",
    currency: "bitcoin",
    destination: document.getElementById("btc_wallet").value,
    name: "***",
  };

  try {
    const response = await fetch(`${api}/withdraw`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    showNotification(true, "Withdraw Successful");
    setInterval(function () {
      window.location.href = "./withdraw-history.html";
    }, 1000);
  } catch (error) {
    showNotification(false, error);
  }
};

document.getElementById("confirmBank").onsubmit = (e) => {
  e.preventDefault();
};

document.getElementById("confirmBankSubmit").onclick = async (e) => {
  e.preventDefault();

  const data = {
    user_id: user.user.id,
    amount,
    withdrawal_type: "bank_transfer",
    currency: document.getElementById("routing_no").value,
    destination:
      document.getElementById("bank_name").value +
      " with " +
      document.getElementById("account_number").value,
    name: document.getElementById("account_name").value,
  };

  try {
    const response = await fetch(`${api}/withdraw`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(data),
    });

    // const result = await response.json();
    showNotification(true, "Withdraw Successful");

    setInterval(function () {
      window.location.href = "./withdraw-history.html";
    }, 1000);
  } catch (error) {
    showNotification(false, error);
  }
};

function showNotification(status, message) {
  const notificationContainer = document.createElement("div");
  const notificationMessage = document.createElement("p");

  // Set the background color based on the status
  notificationContainer.style.backgroundColor = status ? "green" : "red";

  // Set the message text
  notificationMessage.textContent = message;

  // Style the notification container
  notificationContainer.style.position = "fixed";
  notificationContainer.style.bottom = "0";
  notificationContainer.style.left = "50%";
  notificationContainer.style.transform = "translateX(-50%)";
  notificationContainer.style.padding = "10px";
  notificationContainer.style.color = "white";
  notificationContainer.style.width = "100%";
  notificationContainer.style.textAlign = "center";
  notificationContainer.style.zIndex = "9999"; // Ensure the z-index takes effect

  // Append the message to the container
  notificationContainer.appendChild(notificationMessage);

  // Append the container to the body
  document.body.appendChild(notificationContainer);

  // Move the notification from bottom to top over half a minute
  const interval = 5000; // milliseconds
  const steps = 30; // half a minute

  let step = 0;
  const moveNotification = setInterval(() => {
    if (step >= steps) {
      clearInterval(moveNotification);
      document.body.removeChild(notificationContainer);
    } else {
      notificationContainer.style.bottom = `${(step / steps) * 100}%`;
      step++;
    }
  }, interval / steps);
}

function setAmount(class_holder, data_holder) {
  var elements = document.getElementsByClassName(class_holder);

  for (var i = 0; i < elements.length; i++) {
    elements[i].textContent += data_holder;
  }
}
