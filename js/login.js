document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Verhindere das Standardformularverhalten
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // CSRF-Token von der API abrufen
    const csrfResponse = await fetch('https://auth.gregorkrebs.de/api/form', {
        credentials: 'include' // Einschließen von Cookies im Request
    });
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;

    try {
        const response = await fetch('https://auth.gregorkrebs.de/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken // CSRF-Token in den Header einfügen
            },
            credentials: 'include', // Einschließen von Cookies im Request
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
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
        const response = await fetch('https://auth.gregorkrebs.de/api/status', {
            credentials: 'include' // Cookies werden eingeschlossen
        });

        // Überprüfen des Response-Inhalts vor dem Parsen
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            if (data.loggedIn) {
                window.location.href = 'index.html'; // Weiterleiten auf login.html, wenn nicht angemeldet
            }
        } catch (parseError) {
            console.error('Fehler beim Parsen des JSON:', parseError);
            console.error('Serverantwort:', text);
            // window.location.href = 'login.html'; // Weiterleiten auf login.html im Fehlerfall
        }
    } catch (error) {
        console.error('Fehler beim Überprüfen des Anmeldestatus:', error);
        window.location.href = 'login.html'; // Weiterleiten auf login.html im Fehlerfall
    }
}

// Überprüfen des Anmeldestatus beim Laden der Seite
document.addEventListener('DOMContentLoaded', checkLoginStatus);