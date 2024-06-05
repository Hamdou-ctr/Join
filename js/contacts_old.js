
function init() {
    // Form submission handler (Formularübermittlung )
    const form = document.getElementById('edit-contact-form');
    
    // Check if the form exists (Überprüfen ob das Formular vorhanden ist)
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevents the default form submission behavior (Verhindert das standardmäßige Formularübermittlungsverhalten)
            
            // Example logic to 'save' contact information ( Speichern von Kontaktinformationen)
            const formData = new FormData(form);
            console.log('Form data:', Object.fromEntries(formData.entries())); // Log the form data for demonstration (Formular Datenprotokoll )
            
            // Show an alert to indicate the form was 'saved' (Anzeigen dass das Formular gespeichert wurde)
            alert('Contact saved!');
            
            // Optionally, you can clear the form after saving (Optional können ich das Formular nach dem Speichern löschen)
            form.reset();
        });
    } else {
        console.error('Form not found!');
    }
    document.getElementById('delete-button').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this contact?')) {
            alert('Contact deleted!');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    init();
});

const contactForm = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');

contactForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (name === '' || email === '') {
    alert('Please enter both name and email.');
    return;
  }

  const contact = { name, email };
  addContact(contact);
  contactForm.reset();
});

function addContact(contact) {
  const listItem = document.createElement('li');
  listItem.textContent = `${contact.name} - ${contact.email} - ${contact.phone}`;
  contactList.appendChild(listItem);

  sortContacts();
}

function sortContacts() {
  const contacts = Array.from(contactList.getElementsByTagName('li'));
  contacts.sort((a, b) => {
    const nameA = a.textContent.trim().toLowerCase();
    const nameB = b.textContent.trim().toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  while (contactList.firstChild) {
    contactList.removeChild(contactList.firstChild);
  }

  contacts.forEach(contact => {
    contactList.appendChild(contact);
  });
};


const phoneBook = [
    { name: 'Anna Müller', telefon: '123456789' },
    { name: 'Berta Schmidt', telefon: '987654321' },
    { name: 'Claus Becker', telefon: '555555555' },
    { name: 'David Meier', telefon: '111111111' },
    { name: 'Erika Schulz', telefon: '222222222' }
];

console.log(phoneBook);

// Funktion, um das Telefonbuch alphabetisch zu sortieren
function selectionPhoneBook(book) {
    return book.sort((a, b) => a.name.localeCompare(b.name));
}

// Funktion, um das Telefonbuch anzuzeigen
function showPhoneBook() {
    const phoneBookContainer = document.getElementById('phoneBook');
    const selectedPhoneBookList = selectedPhoneBookList(phoneBook);

    selectedPhoneBookList.forEach(eintrag => {
        const eintragElement = document.createElement('div');
        eintragElement.className = 'eintrag';
        eintragElement.textContent = `${eintrag.name}: ${eintrag.telefon}`;
        phoneBookListContainer.appendChild(eintragElement);
    });
}

// Telefonbuch anzeigen, wenn die Seite geladen wird
window.onload = zeigePhoneList;
/*
const contactForm = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');

contactForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (name === '' || email === '') {
    alert('Please enter both name and email.');
    return;
  }

  const contact = { name, email };
  addContact(contact);
  contactForm.reset();
});

function addContact(contact) {
  const listItem = document.createElement('li');
  listItem.textContent = `${contact.name} - ${contact.email}`;
  contactList.appendChild(listItem);

  sortContacts();
}

function sortContacts() {
  const contacts = Array.from(contactList.getElementsByTagName('li'));
  contacts.sort((a, b) => {
    const nameA = a.textContent.trim().toLowerCase();
    const nameB = b.textContent.trim().toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  while (contactList.firstChild) {
    contactList.removeChild(contactList.firstChild);
  }

  contacts.forEach(contact => {
    contactList.appendChild(contact);
  });
}*/










