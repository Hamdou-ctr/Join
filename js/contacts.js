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
                    <p>Name: ${contact.name}</p>
                    <p>Email: ${contact.mail}</p>
                    <p>Telefonnummer: ${contact.telefonnummer}</p>
                </div>
            `;
            contactsDiv.innerHTML += contactInfo;
        }
    }
}