const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('/secret_vault.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'secret_vault.png'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`[+] Challenge 2 (Steganography) server listening on port ${PORT}`);
});
