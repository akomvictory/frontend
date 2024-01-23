const api = "https://admin.coinpecko.online/api/";
//const api = "http://127.0.0.1:8000/api/";
const form = document.getElementById("sbmt");
const user = JSON.parse(localStorage.getItem("user"));

if (user == null) {
  window.location.href = "../signin.html";
}
const id = user.user.kyc_info.id;
let _result;
let _token = user.access_token.original.access_token;

let DLF_URL;
let DLF_ID;
let DLB_URL;
let DLB_ID;
document.addEventListener("DOMContentLoaded", function () {
  // Cloudinary configuration
  cloudinary.setCloudName("dxr49fy98");
  cloudinary.setAPIKey("849642262735529");

  // Upload widget for driver's license front
  let uploadWidgetFront = cloudinary.createUploadWidget(
    {
      cloudName: "dxr49fy98",
      uploadPreset: "coinpecko",
      sources: [
        "local",
        "url",
        "camera",
        "image_search",
        "dropbox",
        "google_drive",
      ],
      cropping: true,
      croppingAspectRatio: 16 / 9,
      folder: "driver_licence_front",
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        // Handle successful upload for driver's license front
        DLF_ID = result.info.public_id;
        DLF_URL = result.info.secure_url;
        // driver_licence_back_name
        document.getElementById("driver_licence_front_name").textContent =
          result.info.original_filename + "." + result.info.format;
      }
    }
  );

  // Upload widget for driver's license back
  let uploadWidgetBack = cloudinary.createUploadWidget(
    {
      cloudName: "dxr49fy98",
      uploadPreset: "coinpecko",
      sources: [
        "local",
        "url",
        "camera",
        "image_search",
        "dropbox",
        "google_drive",
      ],
      cropping: true,
      croppingAspectRatio: 16 / 9,
      folder: "driver_licence_back",
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        // Handle successful upload for driver's license back
        console.log(result.info);
        DLB_ID = result.info.public_id;
        DLB_URL = result.info.secure_url;

        document.getElementById("driver_licence_back_name").textContent =
          result.info.original_filename + "." + result.info.format;
      }
    }
  );

  // Attach click event listeners to trigger Cloudinary upload widgets
  document
    .getElementById("driver_licence_front")
    .addEventListener("click", () => {
      uploadWidgetFront.open();
    });

  document
    .getElementById("driver_licence_back")
    .addEventListener("click", () => {
      uploadWidgetBack.open();
    });
});

document.getElementById("form").onsubmit = (e) => {
  e.preventDefault();
};

(async function getter() {
  try {
    const response = await fetch(`${api}kyc_info/${id}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
    });

    const result = await response.json();
    _result = result;

    document.getElementById("driver_licence_front");
    document.getElementById("driver_licence_back");
    document.getElementById("ssn").value = result.data.ssn;
    document.getElementById("phone").value = result.data.number;
  } catch (error) {
    window.location.href = "../../signin.html";
  }
})();

form.addEventListener("click", async function (e) {
  e.preventDefault();
  let driver_licence_front = document.getElementById("driver_licence_front");
  let driver_licence_back = document.getElementById("driver_licence_back");
  let ssn = document.getElementById("ssn").value;
  let phone = document.getElementById("phone").value;

  const data = {
    user_id: user.user.id,

    DLB_image_id: DLB_ID ? DLB_ID : _result.data.DLB_image_id,

    DLB_image_url: DLB_URL ? DLB_URL : _result.data.DLB_image_url,

    DLF_image_id: DLF_ID ? DLF_ID : _result.data.DLF_image_id,

    DLF_image_url: DLF_URL ? DLF_URL : _result.data.DLF_image_url,

    ssn,
    number: phone,
  };
 
  try {
    const response = await fetch(`${api}kyc_info/${id}`, {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.data) {
      showNotification(true, "upload Succesful");
      setInterval(() => {
        window.location.href = "../index.html";
      }, 2000);
    } else {
      showNotification(false, result.message);
      window.location.href = "../../signin.html";
    }
  } catch (error) {
    console.error("Error:", error);
    showNotification(false, "Uplaod Error");
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
