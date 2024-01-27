const id = JSON.parse(localStorage.getItem("user"));
const referralURL = document.getElementById("referralURL");

const api = "https://admin.coinpecko.online/api";
//const api = "http://127.0.0.1:8000/api";
const user = JSON.parse(localStorage.getItem("user"));
if (user == null) {
  window.location.href = "../signin.html";
}
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

    const investment = filterInvestWithdrawals(result.withdraws);
    console.log(investment);

    // Merge deposit and withdraw arrays
    const transactions = [...investment];

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
      <td data-label="Amount">${transaction.amount}</td>
      <td data-label="Plan">${transaction.plan}</td>
      <td data-label="Return">${transaction.return}</td>
      <td data-label="Status">${
        transaction.return == 1 ? "complete investment" : " pending investment"
      }</td>
        <td data-label="Time">${formatDate(transaction.updated_at)}</td>
    `;
      tbody.appendChild(row);
    });
  } catch (error) {
    window.location.href = "../signin.html";
  }
})();

function filterInvestWithdrawals(withdrawals) {
  const filteredResults = [];

  for (const item of withdrawals) {
    const description = item.destination || "";
    if (description.startsWith("**invest**")) {
      const parts = description.split(/\*\*invest\*\*\s+/);
      const planAndReturn = parts[1] || null;

      // Extract plan and return values
      const match = planAndReturn.match(/(\S+)\s+(.*)/);
      const plan = match ? match[1] : null;
      const returnDetails = match ? match[2] : null;

      filteredResults.push({
        plan: plan,
        return: returnDetails,
        status: item.status,
        amount: item.amount,
        created_at: item.created_at, // Include created_at property
        updated_at: item.updated_at,
      });
    }
  }

  // Sort the filtered results based on created_at in ascending order
  filteredResults.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  return filteredResults;
}

// Example
