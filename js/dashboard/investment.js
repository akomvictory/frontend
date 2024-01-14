const submit = document.getElementById("register");
const api = "http://127.0.0.1:8000/api";
const user = JSON.parse(localStorage.getItem("user"));
let _token = user.access_token.original.access_token;
let _result;
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
    console.log(result);

    document.getElementById("balance").textContent += result.data.balance;
    document.getElementById("bonus").textContent += result.data.bonus;
  } catch (error) {
    window.location.href = "../signin.html";
  }
})();

submit.onsubmit = (e) => {
  e.preventDefault();
  let fixedAmount = document.getElementById("fixedAmount").value;
  if (fixedAmount < _result.data.balance && fixedAmount <= 500) {
    return showNotification(
      false,
      "check wallet balance -> Amount must be greater than $500"
    );
  }
  //remove fixedamount from balance
  //change user account plan
  return showNotification(true, "successful");
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
