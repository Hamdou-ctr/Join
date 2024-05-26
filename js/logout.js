async function logout() {
    try {
        const response = await fetch('https://auth.gregorkrebs.de/api/logout', {
            method: 'POST',
            credentials: 'include', // Einschließen von Cookies im Request
        });
        const data = await response.json();
        if (data.status === '200') {
            console.log("logout successful");
            // document.getElementById("result").innerHTML = "logout successful";
            window.location.href = 'login.html';
        } else {
            console.error("Logout failed.");
            // document.getElementById('result').textContent = "Logout failed. Please try again.";
        }
    } catch (error) {
        console.error('Fehler beim Logout:', error);
    }
}

// Event Listener für Logout-Button hinzufügen
document.getElementById('logoutButton').addEventListener('click', logout);