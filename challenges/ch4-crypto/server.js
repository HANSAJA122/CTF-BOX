const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`[+] Challenge 4 (Caesar Cipher) server listening on port ${PORT}`);
});
