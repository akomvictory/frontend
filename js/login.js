const api = "https://admin.coinpecko.online/api/";
// const api = "http://127.0.0.1:8000/api/";
const form = document.getElementById("sbmt");

form.addEventListener("click", async function (e) {
  e.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const data = { email, password };

  try {
    const response = await fetch(`${api}auth/login`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.message == "Login successful") {
      window.location.href = "dashboard/index.html";
      localStorage.setItem("user", JSON.stringify(result));
    } else {
      alert("Error: " + result.message);
      window.location.href = "signin.html";
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
