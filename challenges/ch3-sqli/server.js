const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Create in-memory SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT, password TEXT, secret_flag TEXT)");
  // Insert secret admin account
  db.run("INSERT INTO users VALUES (1, 'admin', 'SuperComplexPassword!99#$', 'flag{sql1_3xp1o1t3d_5ucce55fully}')");
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Vulnerable Login Endpoint with Intentional SQL Injection Flaw
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // UNSAFE QUERY (String Concatenation Vulnerability)
  // Example exploit payload for username: ' OR '1'='1
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log(`[SQLi Target] Executing Raw Query: ${query}`);

  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: `SQL Error: ${err.message}` });
    }

    if (row) {
      return res.json({
        success: true,
        message: `[+] Authentication Bypassed! Welcome Admin.`,
        flag: row.secret_flag,
        user: row.username,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: '[-] Invalid credentials. Login failed.',
      });
    }
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`[+] Challenge 3 (SQL Injection) server listening on port ${PORT}`);
});
