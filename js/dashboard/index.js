const id = JSON.parse(localStorage.getItem("user"));
const referralURL = document.getElementById("referralURL");

const api = "https://admin.coinpecko.online/api";
//const api = "http://127.0.0.1:8000/api";
const user = JSON.parse(localStorage.getItem("user"));
if (user == null) {
  window.location.href = "../signin.html";
}
if (user == null) {
}
let _token = user.access_token.original.access_token;

referralURL.value += user.user.name;

function calculateTotalAmount(array) {
  // Use the reduce function to sum up all amounts
  const totalAmount = array.reduce((sum, item) => {
    // Parse the amount from string to float and add it to the sum
    return sum + parseFloat(item.amount);
  }, 0);

  return totalAmount.toFixed(2); // Ensure the result is formatted as a string with two decimal places
}

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

(async function getAccountDetails() {
  try {
    const response = await fetch(`${api}/user/${user.user.id}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
    });

    const result = await response.json();

    document.getElementById("balance").textContent += formatNumberWithCommas(
      parseInt(result.account.balance) + parseInt(result.account.earning)
    );
    document.getElementById("bonus").textContent += result.account.bonus;

    //invest

    document.getElementById("invest").textContent += result.account.earning;

  

    document.getElementById("deposit").textContent = calculateTotalAmount(
      result.deposit
    );

    document.getElementById("withdraw").textContent = calculateTotalAmount(
      result.withdraws
    );
    displayTransactions(result.withdraws, result.deposit);
  } catch (error) {
    window.location.href = "../signin.html";
  }
})();

function displayTransactions(withdraws, deposits) {
  const tbody = document.getElementById("items");

  // Combine and sort the 'withdraws' and 'deposits' arrays based on the timestamp
  const transactions = [...withdraws, ...deposits].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Loop through the sorted transactions
  transactions.forEach((item) => {
    const row = document.createElement("tr");

    // Format date
    const date = new Date(item.created_at);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    // Format amount (assuming the amount is in dollars)
    const formattedAmount = parseFloat(item.amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    // Determine the color based on transaction type and status
    let textColor;
    if (item.amount.startsWith("-")) {
      textColor = item.status === 0 ? "text-blue" : "text-danger"; // Withdraw
    } else {
      textColor = item.status === "pending" ? "text-blue" : "text-success"; // Deposit
    }

    // Determine the status text
    const statusText = item.status === 0 ? "Incomplete" : "Complete";

    // Create table cells and set their content
    row.innerHTML = `
      <td data-label="Date">${formattedDate}</td>
      <td data-label="Transaction ID"><span class="${textColor}">${
      item.id
    }</span></td>
      <td data-label="Amount"><span class="${textColor}">${formattedAmount}</span></td>
      <td data-label="Wallet"><span class="badge badge-primary">${
        item.currency
      } Wallet</span></td>
      <td data-label="Details">${item.amount} ${item.currency} ${
      item.withdrawal_type === "crypto" ? "Withdraw" : "Deposit"
    } ${
      item.withdrawal_type === "crypto" ? "Via Crypto" : "Via Bank Transfer"
    }</td>
      <td data-label="Status"><span class="${textColor}">${statusText}</span></td>
    `;

    // Append the row to the tbody
    tbody.appendChild(row);
  });
}
