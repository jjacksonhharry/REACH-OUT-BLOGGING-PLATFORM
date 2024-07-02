const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, confirmPassword })
    });

    if (response.ok) {
        Swal.fire({
            title: "Good job!",
            text: "User registered successfully",
            icon: "success"
        }).then(() => {
            // Clear the form fields
            document.getElementById('username').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('confirmPassword').value = '';

            // Switch to the login form
            container.classList.remove("right-panel-active");
        });
    } else {
        const error = await response.text();
        Swal.fire({
            title: "Error",
            text: `Error: ${error}`,
            icon: "error"
        });
    }
});

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        Swal.fire({
            title: "Success",
            text: "Login successful",
            icon: "success"
        }).then(() => {
            window.location.href = 'home.html';  // Redirect to welcome page
        });
    } else {
        const error = await response.text();
        Swal.fire({
            title: "Error",
            text: `Error: ${error}`,
            icon: "error"
        });
    }
});

document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = 'auth.html';
});

document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = 'auth.html';
});