const amount = document.getElementById("amount");
amount.onchange = () => {
  console.log("high");
};
document.getElementById("register").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("sdasda");
});

document.getElementById("submit").onclick = (e) => {
  e.preventDefault();
  console.log(amount, typeof amount);
  if (parseInt(amount) >= 200 && amount !== "") {
    setAmount();
    document.getElementById("first").style.display = "none";
    document.getElementById("second").style.display = "block";

    // document.getElementById("submit").setAttribute("data-dismiss", "modal");
  } else {
    showNotification(false, "Amount must be more than $200");
  }
};

document.getElementById("confirm").onclick = (e) => {
  e.preventDefault();
  setAmount();
  document.getElementById("second").style.display = "none";
  document.getElementById("third").style.display = "block";
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
    elements[i].textContent = amount;
  }
}
