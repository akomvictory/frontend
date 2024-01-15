const api = "http://127.0.0.1:8000/api/";

const user = JSON.parse(localStorage.getItem("user"));
let _token = user.access_token.original.access_token;

const submit = document.getElementById("sbmt");

document.getElementById("state").value = user.user.state;
document.getElementById("zip").value = user.user.zip_code;
document.getElementById("city").value = user.user.city;
document.getElementById("name").value = user.user.name;
document.getElementById("email").value = user.user.email;
document.getElementById("mobile").value = user.user.phone_number;
document.getElementById("country").value = user.user.country;

document.getElementById("form").onsubmit = (e) => {
  e.preventDefault();
  console.log("our");
};

submit.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("ininin");
  let state = document.getElementById("state").value;
  let zip = document.getElementById("zip").value;
  let city = document.getElementById("city").value;

  const data = { state, zip, city };

  try {
    const response = await fetch(`${api}user/${user.user.id}`, {
      method: "PATCH", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    showNotification(true, "Details Updated Succesfully ");
  } catch (error) {
    showNotification("Error:", error);
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
