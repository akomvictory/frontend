const api = 'http://127.0.0.1:8000/'
const form = document.getElementById('sbmt');


form.addEventListener('click', async function(e) {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    
    const data ={email, password}

    console.log(data);
    try {
        const response = await fetch(`${api}api/auth/login`, {
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
         // window.location.href = 'dashboard.html'
            localStorage.setItem('user', JSON.stringify(result));

        
           console.log(JSON.stringify(result));

        } else{
                alert('Error: ' + result.message);
                window.location.href = 'signin.html';
        }
      } catch (error) {
        console.error("Error:", error);
    }
});