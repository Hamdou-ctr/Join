document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Verhindere das Standardformularverhalten
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://auth.armhosting.de/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Einschließen von Cookies im Request
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        // document.getElementById('result').textContent = data.status;
        if (data.status === '200') {
            console.log("login successful");
            document.getElementById("result").innerHTML = "login successful";
            window.location.href = 'index.html'; // Weiterleiten auf index.html
        } else if (data.status === '403') {
            alert("Username or password incorrect.");
            document.getElementById('result').textContent = "Username or password incorrect. Please try again.";
        }
    } catch (error) {
        console.error('Fehler beim Login:', error);
    }
});

async function checkLoginStatus() {
    try {
        const response = await fetch('https://auth.armhosting.de/api/status', {
            credentials: 'include' // Einschließen von Cookies im Request
        });
        const data = await response.json();
        if (data.loggedIn) {
            window.location.href = 'index.html'; // Weiterleiten auf index.html, wenn bereits angemeldet
        } else {
            document.getElementById('result').textContent = 'Nicht angemeldet';
        }
    } catch (error) {
        console.error('Fehler beim Überprüfen des Anmeldestatus:', error);
    }
}

// Überprüfen des Anmeldestatus beim Laden der Seite
document.addEventListener('DOMContentLoaded', checkLoginStatus);
