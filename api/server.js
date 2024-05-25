const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
(async () => {
    const fetch = (await import('node-fetch')).default;
})();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors({
    origin: 'https://join-210.gregorkrebs.de/', // Die genaue URL Ihrer Frontend-Anwendung
    credentials: true // CORS-Einstellungen, um Cookies zuzulassen
}));

app.use(bodyParser.json()); // Middleware, um JSON-Körper zu parsen
app.use(cookieParser());

// Session-Management einrichten
app.use(session({
    secret: 'geheime_schlüssel',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Setzen Sie dies auf true, wenn Sie HTTPS verwenden
        httpOnly: true,
        maxAge: 7200000,
        sameSite: 'lax' // SameSite-Attribut für Cookies setzen
    }
}));

const fireBaseURL = 'https://join-210-default-rtdb.europe-west1.firebasedatabase.app/accounts/';

// Funktion zur Erstellung eines SHA-512 Hash mit Salt
function sha512(password, salt) {
    const hash = crypto.createHmac('sha512', salt); // Verwende SHA-512 und Salt
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        hash: value
    };
}

// Funktion zur Erstellung eines Salts
function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// Funktion zur Anmeldung
async function login(username, password) {
    try {
        let res = await fetch(`${fireBaseURL}/${username}.json`);
        let userData = await res.json();

        console.log('User Data:', userData);

        if (userData) {
            const { salt, password: storedPassword } = userData; // Renaming to avoid shadowing
            if (!salt || !storedPassword) {
                console.error('Salt or password missing in user data');
                return false;
            }
            const hashedPassword = sha512(password, salt);
            if (hashedPassword.hash === storedPassword) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
}

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const isValidUser = await login(username, password);

    if (isValidUser) {
        // Sitzung speichern
        req.session.username = username;
        console.log('Session created:', req.session); // Debugging: Anzeigen der Sitzung
        res.json({ status: '200' });
    } else {
        res.json({ status: '403' });
    }
});

// Endpunkt zur Überprüfung des Anmeldestatus
app.get('/api/status', (req, res) => {
    console.log('Session check:', req.session); // Debugging: Anzeigen der aktuellen Sitzung
    if (req.session.username) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log(`Server läuft auf http://localhost:3000`);
});

// Beispiel zum Erstellen eines neuen Benutzers
async function createUser(username, password) {
    const salt = genRandomString(16); // Erstelle einen 16 Byte langen Salt
    const hashedPassword = sha512(password, salt);

    const user = {
        username: username,
        password: hashedPassword.hash,
        salt: salt,
        email: `${username}@mail.de`
    };

    // Speichern des Benutzers in der Firebase-Datenbank
    await fetch(`${fireBaseURL}/${username}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    console.log(`Benutzer ${username} erstellt.`);
}

// Beispielaufruf zum Erstellen eines Benutzers
// createUser('admin', 'password');