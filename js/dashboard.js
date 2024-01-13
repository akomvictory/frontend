const id = JSON.parse(localStorage.getItem('user'));

try {
    const response = await fetch(`${api}/api/account/{id}`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
    if(result.message == 'Login successful'){
        window.location.href = 'dashboard.html'
        localStorage.setItem('user', JSON.stringify(result));

    } else{
            alert('Error: ' + result.message);
            window.location.href = 'signin.html';
    }
  } catch (error) {
    console.error("Error:", error);
}