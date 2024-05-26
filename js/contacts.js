async function contacts() {
    let resp = await fetch("contacts.json");
    let respAsJson = await resp.json();

    let contactsDiv = document.getElementById("contacts");
    contactsDiv.innerHTML = ""; // Clear any existing content

    for (let key in respAsJson.contact) {
        if (respAsJson.contact.hasOwnProperty(key)) {
            let contact = respAsJson.contact[key];
            let contactInfo = `
                <div>
                    <img src="./assets/img/default_profil_pic.png" alt="Profile picture">
                    <div>
                        <p>${contact.name}</p><br>
                        <a href="mailto:${contact.mail}">${contact.mail}</a><br>
                        <p>+${contact.telefonnummer}</p> 
                        
                    </div>
                </div>
            `;
            contactsDiv.innerHTML += contactInfo;
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    //form.addEventListener('submit', function(event) {
    //event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    window.submitForm = function() {

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const telefonnummer = document.getElementById('telefonnummer').value;

            // Überprüfung der eingegebenen Daten
            if (validateForm(name, email, telefonnummer)) {
                // Hier kannst du den Code zum Senden der Daten an einen Server einfügen
                console.log('Formular erfolgreich abgeschickt');
                console.log('Name:', name);
                console.log('E-Mail:', email);
                console.log('Telefonnummer:', telefonnummer);

                // Formular zurücksetzen
                form.reset();
            } else {
                console.log('Überprüfung fehlgeschlagen');
            }
        }
        // Eingabefeld löschen
    window.clearInput = function(fieldId) {
        document.getElementById(fieldId).value = '';
    }

    function validateForm(name, email, telefonnummer) {
        // Einfache Überprüfung der Formulareingaben
        if (name.trim() === '' || email.trim() === '' || telefonnummer.trim() === '') {
            alert('Bitte füllen Sie alle Felder aus');
            return false;
        }

        // Überprüfung der E-Mail-Adresse mit einem einfachen Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Bitte geben Sie eine gültige E-Mail-Adresse ein');
            return false;
        }

        // Überprüfung der Telefonnummer (dieser Regex akzeptiert nur Zahlen)
        const telefonnummerRegex = /^\d+$/;
        if (!telefonnummerRegex.test(telefonnummer)) {
            alert('Bitte geben Sie eine gültige Telefonnummer ein');
            return false;
        }

        return true;
    }
});