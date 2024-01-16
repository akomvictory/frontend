const register = document.getElementById("register");
const api = "https://admin.coinpecko.online/api";
//const api = "http://127.0.0.1:8000/api";
const user = JSON.parse(localStorage.getItem("user"));
let _token = user.access_token.original.access_token;
let _result = { data: JSON.parse(localStorage.getItem("user")).account };
let plan = "";
let check = false;

document.getElementById("premium").onclick = () => {
  plan = "premium";
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
};

document.getElementById("gold").onclick = () => {
  plan = "gold";
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
};

document.getElementById("silver").onclick = () => {
  plan = "silver";
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
};

document.getElementById("bronze").onclick = () => {
  plan = "bronze";
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
};

(async function getAccountDetails() {
  try {
    const response = await fetch(`${api}/account/${user.user.id}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
    });

    const result = await response.json();
    _result = result;

    document.getElementById("balance").textContent += result.data.balance;
    document.getElementById("bonus").textContent += result.data.bonus;
  } catch (error) {
    window.location.href = "../signin.html";
  }
})().then(() => {
  check = true;
});

document.getElementById("submit").onclick = async () => {
  if (check == false) return;
  let fixedAmount = document.getElementById("fixedAmount").value;

  if (
    parseInt(_result.data.balance) >= parseInt(fixedAmount) &&
    500 <= parseInt(fixedAmount) &&
    fixedAmount !== ""
  ) {
    //remove fixedamount from balance
    //change user account plan

    const withdraw_data = {
      user_id: user.user.id,
      amount: fixedAmount,
      withdrawal_type: "crypto",
      currency: "bitcoin",
      destination: "invest",
      name: "coinpecko",
    };

    try {
      const response = await fetch(`${api}/withdraw`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${_token}`,
        },
        body: JSON.stringify(withdraw_data),
      });
      updateAccount();
    } catch (error) {
      showNotification(false, error);
    }
    return showNotification(true, "successful");
  }

  return showNotification(
    false,
    "check wallet balance -> Amount must be greater than $500"
  );

  async function updateAccount() {
    const currentAmount = _result.data.balance - fixedAmount;
    const data = {
      user_id: user.user.id,
      balance: `${currentAmount}`,
      earning: _result.data.earning,
      bonus: _result.data.bonus,
      account_type: "margin",
      account_stage: "plan",
      trade: 1,
    };

    try {
      const response = await fetch(`${api}/account/${user.user.id}`, {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${_token}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      showNotification(false, "Unsuccessful");
    }
  }
};

register.addEventListener("submit", function (e) {
  e.preventDefault();
});

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
