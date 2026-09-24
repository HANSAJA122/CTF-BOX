const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/secret_admin_notes.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'secret_admin_notes.txt'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`[+] Challenge 1 (OSINT Recon) server listening on port ${PORT}`);
});
