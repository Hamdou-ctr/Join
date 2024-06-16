


async function loadContacts() {
    try {
        let response = await fetch('/contacts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);

        // Display contacts on the page
        displayContacts(data.alphabet);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

function displayContacts(alphabet) {
    alphabet.forEach(group => {
        const letter = group.letter;
        const contacts = group.contacts;

        let groupDiv = document.getElementById(letter);
        if (!groupDiv) {
            groupDiv = document.createElement('div');
            groupDiv.id = letter;
            groupDiv.className = 'alphabet-group';
            groupDiv.innerHTML = `<h2>${letter}</h2>`;
            document.getElementById('contacts').appendChild(groupDiv);
        }

        // Clear previous contacts
        groupDiv.innerHTML = `<h2>${letter}</h2>`;

        contacts.forEach(contact => {
            const firstName = contact.firstname;
            const lastName = contact.lastname;
            const email = contact.mail;
            const phone = contact.phonenumber;

            const avatarText = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
            const contactHTML = `
                <div class="contact">
                    <div class="avatar">${avatarText}</div>
                    <div class="details">
                        <div class="name">${firstName} ${lastName}</div>
                        <div class="email">${email}</div>
                        <div class="phone">${phone}</div>
                    </div>
                </div>
            `;
            groupDiv.innerHTML += contactHTML;
        });
    });
}

function openAddContactForm() {
    document.getElementById('addContactForm').style.display = 'block';
}

function closeAddContactForm() {
    document.getElementById('addContactForm').style.display = 'none';
}

function addContact() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (!firstName || !lastName || !email || !phone) {
        alert('Please fill in all fields.');
        return;
    }

    const initial = firstName.charAt(0).toUpperCase();
    const avatarText = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
    const contactHTML = `
        <div class="contact">
            <div class="avatar">${avatarText}</div>
            <div class="details">
                <div class="name">${firstName} ${lastName}</div>
                <div class="email">${email}</div>
                <div class="phone">${phone}</div>
            </div>
        </div>
    `;

    let group = document.getElementById(initial);
    if (!group) {
        group = document.createElement('div');
        group.id = initial;
        group.className = 'alphabet-group';
        group.innerHTML = `<h2>${initial}</h2>`;
        document.getElementById('contacts').appendChild(group);
    }

    group.innerHTML += contactHTML;

    // Clear form
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';

    closeAddContactForm();
}



