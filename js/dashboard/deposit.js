const user = JSON.parse(localStorage.getItem("user"));
if (user == null) {
  window.location.href = "../signin.html";
}
const _amount = document.getElementById("amount");
let amount = 0;
const api = "https://admin.coinpecko.online/api";
//const api = "http://127.0.0.1:8000/api";
let _token = user.access_token.original.access_token;
let wallet_address = "bc1qytwvayz74lsw40z66agk2q33kssup9z7726akk";
_amount.onchange = (e) => {
  amount = e.currentTarget.value;
};
let deposit_id;
let deposit_url;

// Function to remove the image preview
function removePreview() {
  previewImage.src = "https://legaltrademining.com/assets/images/default.png";

  // Optional: Clear the file input value
  fileInput.value = "";
}

document.addEventListener("DOMContentLoaded", function () {
  // Cloudinary configuration
  cloudinary.setCloudName("dxr49fy98");
  cloudinary.setAPIKey("849642262735529");

  // Upload widget for driver's license back
  let uploadWidgetDeposit = cloudinary.createUploadWidget(
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
        deposit_id = result.info.public_id;
        deposit_url = result.info.secure_url;

        // Update the preview image with the uploaded image
        document.getElementById("previewImage").src = deposit_url;

        document.getElementById("fileInput_name").textContent =
          result.info.original_filename + "." + result.info.format;
      }
    }
  );

  // Attach click event listeners to trigger Cloudinary upload widgets
  document.getElementById("fileInput").addEventListener("click", () => {
    uploadWidgetDeposit.open();
  });
});

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
  document.getElementById("second").style.display = "none";
  document.getElementById("third").style.display = "block";
};

function setAmount() {
  var elements = document.getElementsByClassName("amount_holder");

  for (var i = 0; i < elements.length; i++) {
    elements[i].textContent += amount;
  }
}

document.getElementById("payform").onsubmit = (e) => {
  e.preventDefault();
};

document.getElementById("pay").onclick = async () => {
  if (document.getElementById("fileInput_name").textContent == "") {
    return showNotification(false, "please add deposit schreenshot");
  }

  const data = {
    user_id: user.user.id,
    amount,
    wallet_address,
    currency: "bitcoin",
    image_url: deposit_url,
    image_id: deposit_id,
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
    if (result.data) {
      showNotification(true, "Deposit Successful");
      setInterval(() => {
        window.location.href = "./deposit-history.html";
      }, 2000);
      return;
    }
    showNotification(false, "Error on Deposit");
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
