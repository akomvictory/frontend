const user = JSON.parse(localStorage.getItem("user"));
const _amount = document.getElementById("amount");
let amount = 0;
const api = "http://admin.coinpecko.online/api";
let _token = user.access_token.original.access_token;
let wallet_address = "s423423fdsf";
_amount.onchange = (e) => {
  amount = e.currentTarget.value;
};

document.getElementById("register").addEventListener("submit", function (e) {
  e.preventDefault();
});

document.getElementById("submit").onclick = (e) => {
  e.preventDefault();

  if (parseInt(amount) >= 200 && amount !== "") {
    setAmount();
    document.getElementById("wallet").textContent = wallet_address;
    document.getElementById("first").style.display = "none";
    document.getElementById("second").style.display = "block";

    document.getElementById("submit").setAttribute("data-dismiss", "modal");
  } else {
    showNotification(false, "Amount must be more than $200");
  }
};

document.getElementById("confirm").onclick = async (e) => {
  e.preventDefault();
  setAmount();
  document.getElementById("second").style.display = "none";
  document.getElementById("third").style.display = "block";

  const data = {
    user_id: user.user.id,
    amount,
    wallet_address,
    currency: "bitcoin",
  };

  try {
    const response = await fetch(`${api}/deposit`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
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

function setAmount() {
  var elements = document.getElementsByClassName("amount_holder");

  for (var i = 0; i < elements.length; i++) {
    elements[i].textContent += amount;
  }
}

document.getElementById("payform").onsubmit = (e) => {
  e.preventDefault();
  window.location.href = "./deposit-history.html";
};

// document.getElementById("pay").onclick = () => {
//   window.location.href = "/deposit-history.html";
// };
