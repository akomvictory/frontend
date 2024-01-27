// Get a reference to the element
const referralParent = document.getElementById("referral_parent");

// Add event listener to the element
referralParent.addEventListener("click", function () {
  // Check if the element has the class "show"
  if (referralParent.classList.contains("show")) {
    // Task to perform when "show" class is present
    document.getElementById("referral_child").style = "display: none;";
  } else {
    // Task to perform when "show" class is not present

    document.getElementById("referral_child").style = "display: block;";
  }

  // Toggle the "show" class
  referralParent.classList.toggle("show");
});

// Get a reference to the element
const userParent = document.getElementById("user_parent");

// Add event listener to the element
userParent.addEventListener("click", function () {
  // Check if the element has the class "show"
  if (userParent.classList.contains("show")) {
    // Task to perform when "show" class is present
    document.getElementById("user_child").style = "display: none;";
  } else {
    // Task to perform when "show" class is not present

    document.getElementById("user_child").style = "display: block;";
  }

  // Toggle the "show" class
  userParent.classList.toggle("show");
});
