async function checkLoginStatus() {
    try {
        const response = await fetch('https://auth.gregorkrebs.de/api/status', {
            credentials: 'include' // Cookies werden eingeschlossen
        });

        // Überprüfen des Response-Inhalts vor dem Parsen
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            if (!data.loggedIn) {
                window.location.href = 'login.html'; // Weiterleiten auf login.html, wenn nicht angemeldet
            }
        } catch (parseError) {
            console.error('Fehler beim Parsen des JSON:', parseError);
            console.error('Serverantwort:', text);
            //window.location.href = 'login.html'; // Weiterleiten auf login.html im Fehlerfall
        }
    } catch (error) {
        console.error('Fehler beim Überprüfen des Anmeldestatus:', error);
        window.location.href = 'login.html'; // Weiterleiten auf login.html im Fehlerfall
    }
}

// Überprüfen des Anmeldestatus beim Laden der Seite
document.addEventListener('DOMContentLoaded', checkLoginStatus);