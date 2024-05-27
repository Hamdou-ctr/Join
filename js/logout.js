async function logout() {
    const csrfResponse = await fetch('https://auth.gregorkrebs.de/api/form', {
        credentials: 'include'
    });
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;

    try {
        const response = await fetch('https://auth.gregorkrebs.de/api/logout', {
            method: 'POST',
            headers: {
                'CSRF-Token': csrfToken
            },
            credentials: 'include',
        });
        const data = await response.json();
        if (data.status === '200') {
            console.log("logout successful");
            // document.getElementById("result").innerHTML = "logout successful";
            window.location.href = 'login.html';
        } else {
            alert("Logout failed.");
            // document.getElementById('result').textContent = "Logout failed. Please try again.";
        }
    } catch (error) {
        console.error('Fehler beim Logout:', error);
    }
}

document.getElementById('logoutButton').addEventListener('click', logout);