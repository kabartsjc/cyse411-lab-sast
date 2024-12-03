const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Create database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'testdb',
});

db.connect();

// Middleware
app.use(bodyParser.json());
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
}));

// Vulnerability 1: SQL Injection
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else if (result.length > 0) {
      res.send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// Vulnerability 2: Cross-Site Scripting (XSS)
app.get('/user/:username', (req, res) => {
  const { username } = req.params;
  res.send(`<h1>Welcome, ${username}</h1>`);
});

// Vulnerability 3: Insecure Direct Object References (IDOR)
app.get('/user/profile/:id', (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id=${userId}`;

  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});

// Vulnerability 4: Unsecure File Uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded');
});

// Vulnerability 5: Session Fixation
app.get('/login', (req, res) => {
  req.session.userId = req.query.userId; // attacker-controlled session ID
  res.send('Session started');
});

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
