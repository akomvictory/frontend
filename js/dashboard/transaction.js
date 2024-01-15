const id = JSON.parse(localStorage.getItem("user"));
const referralURL = document.getElementById("referralURL");

const api = "http://admin.coinpecko.online/api";

const user = JSON.parse(localStorage.getItem("user"));
let _token = user.access_token.original.access_token;

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

    // Merge deposit and withdraw arrays
    const transactions = [...result.deposit, ...result.withdraws];

    // Sort transactions based on created_at in descending order (newest to oldest)
    transactions.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Get the tbody element to append rows
    const tbody = document.getElementById("transactionTableBody");

    // Function to format date in the desired format
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getDate()} ${date.toLocaleDateString("en", {
        month: "short",
      })}, ${date.toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    };

    // Iterate through sorted transactions and populate the table
    transactions.forEach((transaction) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="Date">${formatDate(transaction.created_at)}</td>
        <td data-label="#Trx">${transaction.id}</td>
        <td data-label="Details">${
          transaction.status === "pending" ? "Deposit" : "Withdraw"
        }: ${transaction.amount} ${transaction.currency}</td>
        <td data-label="Amount">
            <strong class="${
              transaction.status === "pending" ? "text-warning" : "text-danger"
            }">
                ${transaction.status === "pending" ? "+" : "-"} ${
        transaction.amount
      } ${transaction.currency}
            </strong>
        </td>
        
    `;
      tbody.appendChild(row);
    });
  } catch (error) {
    window.location.href = "../signin.html";
  }
})();
