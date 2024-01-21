const api = "https://admin.coinpecko.online/api/";
//const api = "http://127.0.0.1:8000/api/";
const form = document.getElementById("sbmt");
const user = JSON.parse(localStorage.getItem("user"));


if (user == null) {
    window.location.href = "../signin.html";
  }
  if (user == null) {
  }

  const id  = user.user.kyc_info.id

let _token = user.access_token.original.access_token;




form.addEventListener("click", async function (e) {
  e.preventDefault();
  let driver_licence_front = document.getElementById("driver_licence_front").value;
  let driver_licence_back = document.getElementById("driver_licence_back").value;
  let ssn = document.getElementById("ssn").value;
  let phone = document.getElementById("phone").value;

  const data = { driver_licence_front, driver_licence_front, ssn, phone };




  try {
    const response = await fetch(`${api}kyc_info/${id}`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);
    // if (result.message == "Login successful") {
    //   window.location.href = "dashboard/index.html";
    //   localStorage.setItem("user", JSON.stringify(result));

     
    // } else {
    //   alert("Error: " + result.message);
    //   window.location.href = "signin.html";
    // }
  } catch (error) {
    console.error("Error:", error);
  }
});
