const api = "http://127.0.0.1:8000/api";
const user = JSON.parse(localStorage.getItem("user"));
let _token = user.access_token.original.access_token;

// Function to generate random characters for #Trx
function generateRandomTrx(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

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
let depositData = [];

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
    depositData = result.deposit;

    // Loop through deposit data and add rows to the table
    depositData.forEach((data) => {
      // Modify data as needed to match the structure
      const rowData = {
        "#Trx": generateRandomTrx(10),
        Gateway: "Bitcoin",
        Amount: {
          class: "strong-class",
          content: "<strong>" + data.amount + " Dollars</strong>",
        },
        Status: { class: "badge badge-warning", content: data.status },
        Time: {
          class: "",
          content: new Date(data.created_at),
        },
        Wallet_Address: data.wallet_address,
        //   '<a href="javascript:void(0)" class="icon-btn base--bg approveBtn text-dark" data-info="{&quot;screenshot/proof&quot;:{&quot;field_name&quot;:&quot;2024/01/14/65a42080367621705255040.png&quot;,&quot;type&quot;:&quot;file&quot;}}" data-id="' +
        //   data.id +
        //   '" data-amount="' +
        //   data.amount +
        //   '" data-charge="0 Dollars" data-after_charge="' +
        //   data.amount +
        //   ' Dollars" data-rate="1 $" data-payable="' +
        //   data.amount +
        //   ' $"><i class="fa fa-desktop"></i></a>',
      };

      // Add the row to the table
      addTableRow(rowData);
    });
  } catch (error) {
    window.location.href = "../signin.html";
    // console.log(error);
  }
})();
