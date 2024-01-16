const user = JSON.parse(localStorage.getItem("user"));
const api = "https://admin.coinpecko.online/api";
//const api = "http://127.0.0.1:8000/api";
if (user == null) {
  window.location.href = "../index.html";
}
let _token = user.access_token.original.access_token;

// Get the current URL
const currentUrl = window.location.href;

// Function to get the value of a query parameter
function getQueryParam(url, paramName) {
  const urlSearchParams = new URLSearchParams(url.split("?")[1]);
  return urlSearchParams.get(paramName);
}

// Get the token from the URL
const token = getQueryParam(currentUrl, "token");

document.getElementById("form").onsubmit = (e) => {
  e.preventDefault();
};
console.log("boom");
document.getElementById("submit").onclick = async () => {
  let password = document.getElementById("password").value;
  let password_confirmation = document.getElementById(
    "password_confirmation"
  ).value;

  if (password_confirmation !== password) {
    return;
  }

  const data = {
    email: user.user.email,
    password,
    resetToken: token,
    password_confirmation,
  };

  try {
    const response = await fetch(`${api}/resetPassword`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.data) {
      return showNotification(true, result.data);
    }
    if (result.message) {
      return showNotification(false, result.message);
    }
  } catch (error) {
    showNotification(false, "Unsuccesful");
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
