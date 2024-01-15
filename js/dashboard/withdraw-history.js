const api = "http://127.0.0.1:8000/api";
const user = JSON.parse(localStorage.getItem("user"));
let _token = user.access_token.original.access_token;

// Function to add a new table row
function addTableRow(data) {
  const tableBody = document.getElementById("tableBody");
  const newRow = document.createElement("tr");

  // Loop through data properties and create corresponding cells
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const newCell = document.createElement("td");
      newCell.setAttribute("data-label", key);

      // Check if the value is an object (for nested elements)
      if (typeof data[key] === "object") {
        // Assume it's an object with class and content properties
        newCell.innerHTML =
          '<span class="' +
          data[key].class +
          '">' +
          data[key].content +
          "</span>";
      } else {
        newCell.textContent = data[key];
      }

      newRow.appendChild(newCell);
    }
  }

  tableBody.appendChild(newRow);
}

// Example usage for deposit
let withdrawData = [];

function sortDepositByDate(depositArray) {
  // Use the sort function to sort the array by the created_at property
  depositArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return depositArray;
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
    withdrawData = sortDepositByDate(result.withdraws);
    console.log(result.withdraws);
    // Loop through deposit data and add rows to the table
    withdrawData.forEach((data) => {
      // Modify data as needed to match the structure
      const rowData = {
        Description: data.destination,
        Gateway: data.withdrawal_type,
        Amount: {
          class: "strong-class",
          content: "<strong>" + data.amount + " Dollars</strong>",
        },
        Status: {
          class: "badge badge-warning",
          content: data.status == 0 ? "pending" : "complete",
        },
        Time: {
          class: "",
          content: new Date(data.created_at),
        },
        name: data.name,
      };

      // Add the row to the table
      addTableRow(rowData);
    });
  } catch (error) {
    window.location.href = "../signin.html";
    console.log(error);
  }
})();
