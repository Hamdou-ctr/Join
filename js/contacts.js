async function contacts() {
    let resp = await fetch("contacts.json");
    let respAsJson = await resp.json();

    let contactsDiv = document.getElementById("contacts");
    contactsDiv.innerHTML = ""; // Clear any existing content

    // Extract contacts and sort them alphabetically
    let contacts = Object.values(respAsJson.contact).sort((a, b) => a.name.localeCompare(b.name));

    // Create alphabet navigation
    let alphabetDiv = document.getElementById("alphabet");
    alphabetDiv.innerHTML = ""; // Clear any existing content

    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    alphabet.forEach(letter => {
        let letterLink = document.createElement("a");
        letterLink.href = `#${letter}`;
        letterLink.innerText = letter;
        letterLink.id = `link-${letter}`;
        alphabetDiv.appendChild(letterLink);
    });

    // Display sorted contacts and add anchor tags
    let currentLetter = "";
    contacts.forEach(contact => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            contactsDiv.innerHTML += `<h2 id="${currentLetter}">${currentLetter}</h2>`;
        }
        let contactInfo = `
            <div class="contact-card">
                <img src="./assets/img/default_profil_pic.png" alt="Profile picture">
                <div>
                    <p class="contact-name">${contact.name}</p>
                    <a href="mailto:${contact.mail}" class="contact-email">${contact.mail}</a>
                </div>
            </div>
        `;
        contactsDiv.innerHTML += contactInfo;
    });

    // Highlight the corresponding letter when scrolling
    window.addEventListener("scroll", () => {
        let activeLetter = "";
        contacts.forEach(contact => {
            let firstLetter = contact.name.charAt(0).toUpperCase();
            let letterElement = document.getElementById(firstLetter);
            if (letterElement && letterElement.getBoundingClientRect().top <= 0) {
                activeLetter = firstLetter;
            }
        });
        alphabet.forEach(letter => {
            let letterLink = document.getElementById(`link-${letter}`);
            if (letter === activeLetter) {
                letterLink.classList.add("active");
            } else {
                letterLink.classList.remove("active");
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    contacts();
    var popup = document.getElementById("popup");
    var openPopupButton = document.getElementById("openPopup");
    var closePopupButton = document.getElementById("closePopup");

    openPopupButton.addEventListener("click", function() {
        popup.style.display = "flex";
    });

    closePopupButton.addEventListener("click", function() {
        popup.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    });
});
