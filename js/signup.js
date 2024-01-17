//const api = "https://127.0.0.1:8000/api/";
const api = "https://admin.coinpecko.online/api/";
const sbmt = document.getElementById("sbmt");

document.getElementById("form").onsubmit = (e) => {
  e.preventDefault();
};

sbmt.addEventListener("click", async function (e) {
  e.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let street = document.getElementById("street").value;
  let city = document.getElementById("city").value;
  let state = document.getElementById("state").value;
  let zip_code = document.getElementById("zip_code").value;
  let country = document.getElementById("country").value;

  const data = {
    email,
    name,
    street,
    city,
    state,
    zip_code,
    country,
    password,
    password_confirmation: password,
  };

  try {
    const response = await fetch(`${api}auth/register`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.message == "User successfully registered") {
      showNotification(true, result.message);
      setInterval(() => {
        window.location.href = "signin.html";
      }, 1000);
      localStorage.setItem("user", JSON.stringify(result));
    } else {
      showNotification(false + result.message);
      window.location.href = "signup.html";
    }
  } catch (error) {
    console.error("Error:", error);
  }
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
