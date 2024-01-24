const register = document.getElementById("register");
const api = "https://admin.coinpecko.online/api";
//const api = "http://127.0.0.1:8000/api";
const user = JSON.parse(localStorage.getItem("user"));
if (user == null) {
  window.location.href = "../signin.html";
}
let _token = user.access_token.original.access_token;
let _result = { data: JSON.parse(localStorage.getItem("user")).account };
let plan = "";
let check = false;
let allPlan;
let formInvestAmount;
let returned;

document.getElementById("premium").onclick = () => {
  plan = "premium";
  returned = `${allPlan[4].percent}% daily for ${allPlan[4].duration} Days`;
  formInvestAmount = "$200,000 - $1,000,000";
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
  getAccountDetails();
};

document.getElementById("gold").onclick = () => {
  plan = "gold";
  returned = `${allPlan[3].percent}% daily for ${allPlan[3].duration} Days`;
  formInvestAmount = "$150,000 - $750,000";
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
  getAccountDetails();
};

document.getElementById("silver").onclick = () => {
  plan = "silver";
  returned = `${allPlan[2].percent}% daily for ${allPlan[2].duration} Days`;
  formInvestAmount = "$75,000 - $500,000";
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
  getAccountDetails();
};

document.getElementById("bronze").onclick = () => {
  plan = "bronze";
  returned = `${allPlan[1].percent}% daily for ${allPlan[1].duration} Days`;
  formInvestAmount = "$20,000 - $250,000";
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
  getAccountDetails();
};

document.getElementById("beginner").onclick = () => {
  plan = "beginner";
  returned = `${allPlan[0].percent}% daily for ${allPlan[0].duration} Days`;
  formInvestAmount = "$5,000 - $75,000";
  document.getElementById("submit").setAttribute("data-dismiss", "modal");
  getAccountDetails();
};

(async function getPlanDetails() {
  try {
    const response = await fetch(`${api}/plan`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
    });

    const result = await response.json();
    allPlan = result;

    document.querySelectorAll(".premuium_percent").forEach((item) => {
      return (item.textContent += result[4].percent + "%");
    });
    document.getElementById("premium_duration").textContent +=
      result[4].duration + " " + "Days";

    document.querySelectorAll(".gold_percent").forEach((item) => {
      return (item.textContent += result[3].percent + "%");
    });
    document.getElementById("gold_duration").textContent +=
      result[3].duration + " " + "Days";

    document.querySelectorAll(".silver_percent").forEach((item) => {
      return (item.textContent += result[2].percent + "%");
    });
    document.getElementById("silver_duration").textContent +=
      result[2].duration + " " + "Days";

    document.querySelectorAll(".bronze_percent").forEach((item) => {
      return (item.textContent += result[1].percent + "%");
    });
    document.getElementById("bronze_duration").textContent +=
      result[1].duration + " " + "Days";

    document.querySelectorAll(".beginner_percent").forEach((item) => {
      return (item.textContent += result[0].percent + "%");
    });
    document.getElementById("beginner_duration").textContent +=
      result[0].duration + " " + "Days";

    return result;
  } catch (error) {
    window.location.href = "../signin.html";
  }
})().then((res) => {
  if (!res) return;
  check = true;
  AddsbmtAtt("premium");
  AddsbmtAtt("silver");
  AddsbmtAtt("gold");
  AddsbmtAtt("bronze");
  AddsbmtAtt("beginner");
  (async function () {
    try {
      const response = await fetch(`${api}/account/${user.user.account.id}`, {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${_token}`,
        },
      });

      const result = await response.json();
      _result = result;

      document.getElementById("balance").textContent =
        "Deposit Wallet - $" + result.data.balance;
      document.getElementById("bonus").textContent += result.data.bonus;
      document.getElementById("investAmountRenge").textContent =
        "invest: " + "......";
      document.getElementById("interestDetails").textContent =
        "intrest : " + "...." + "%";
      document.getElementById("interestValidaty").textContent =
        "per 1 day, .... times";
    } catch (error) {
      window.location.href = "../signin.html";
    }
  })();
});

function getAccountDetails() {
  document.getElementById("planName").textContent = plan;
  document.getElementById("investAmountRenge").textContent =
    "invest: " + formInvestAmount;
  document.getElementById("interestDetails").textContent =
    "intrest : " + finder("percent", plan, allPlan) + "%";
  document.getElementById("interestValidaty").textContent =
    "per 1 day, " + finder("duration", plan, allPlan) + " days";
}

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
      destination: "**invest** " + plan + "  " + returned,
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
      return updateAccount();
    } catch (error) {
      showNotification(false, error);
    }
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
      account_stage: plan,
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
      showNotification(true, "successful");
      setInterval(() => {
        window.location.href = "./investment-log.html";
      }, 1000);
      return;
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

function finder(field, plan, allPlan) {
  // Find the object with the matching plan
  const matchingPlan = allPlan.find((obj) => obj.plan === plan);

  // If a matching plan is found, return the specified field value; otherwise, return null
  return matchingPlan ? matchingPlan[field] : null;
}

function AddsbmtAtt(plan) {
  document.getElementById(plan).textContent = "Invest Now";
  document.getElementById(plan).setAttribute("data-toggle", "modal");
  document.getElementById(plan).setAttribute("href", "javascript:void(0)");
}
