const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./join-210-firebase-adminsdk-1ijlc-c9669a144d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://join-210-default-rtdb.europe-west1.firebasedatabase.app'
});

const app = express();

app.use(cors({
    origin: 'https://join-210.gregorkrebs.de', // Die genaue URL Ihrer Frontend-Anwendung
    credentials: true // CORS-Einstellungen, um Cookies zuzulassen
}));

app.use(bodyParser.json()); // Middleware, um JSON-Körper zu parsen
app.use(cookieParser());

app.use(session({
    secret: 'geheime_schlüssel',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true, // Setzen Sie dies auf true in Produktion
        httpOnly: true,
        maxAge: 7200000, // Sitzungsdauer in Millisekunden
        sameSite: 'lax' // 'lax' für lokale Entwicklung, 'none' für Produktion
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

// Middleware zur Authentifizierung mit Firebase ID Token
async function authenticateToken(req, res, next) {
    const idToken = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!idToken) return res.sendStatus(401); // Wenn kein Token vorhanden ist, verweigern

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next(); // Fortfahren zur nächsten Middleware/Route
    } catch (error) {
        console.error('Error verifying token:', error);
        res.sendStatus(403); // Wenn das Token ungültig ist, verweigern
    }
}

// Funktion zur Anmeldung
async function login(username, password) {
    try {
        const userRef = admin.database().ref(`/accounts/${username}`);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val();

        console.log('User Data:', userData);

        if (userData) {
            const { salt, password: storedPassword } = userData;
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

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ status: '500', message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // 'connect.sid' ist der Standardname des Session-Cookies
        return res.json({ status: '200', message: 'Logout successful' });
    });
});

// Geschützter Endpunkt zur Datenabfrage mit Authentifizierung
app.get('/api/data', authenticateToken, async (req, res) => {
    const userRef = admin.database().ref('/some/path');
    const snapshot = await userRef.once('value');
    res.json(snapshot.val());
});

app.use(express.static('public'));

https.createServer({
  key: fs.readFileSync(path.resolve('./ssl/auth.gregorkrebs.de.key')),
  cert: fs.readFileSync(path.resolve('./ssl/auth.gregorkrebs.de.crt'))
}, app).listen(3033, () => {
  console.log('Server läuft auf https://auth.gregorkrebs.de');
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
    await admin.database().ref(`/accounts/${username}`).set(user);

    console.log(`Benutzer ${username} erstellt.`);
}

// Beispielaufruf zum Erstellen eines Benutzers
// createUser('hamidou', 'password');
