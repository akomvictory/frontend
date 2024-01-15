//const api = "http://127.0.0.1:8000/api/";
const api = "http://admin.coinpecko.online/api/";
const form = document.getElementById("sbmt");

console.log("enter");

form.addEventListener("click", async function (e) {
  e.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let street = document.getElementById("street").value;
  let city = document.getElementById("city").value;
  let state = document.getElementById("state").value;
  let zip_code = document.getElementById("zip_code").value;
  let country = document.getElementById("country").value;

  const data = {
    email,
    name,
    street,
    city,
    state,
    zip_code,
    country,
    password,
  };

  console.log(data);
  try {
    const response = await fetch(`${api}auth/register`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
    if (result.message == "User successfully registered") {
      window.location.href = "login.html";
      localStorage.setItem("user", JSON.stringify(result));
    } else {
      alert("Error: " + result.message);
      window.location.href = "signup.html";
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
