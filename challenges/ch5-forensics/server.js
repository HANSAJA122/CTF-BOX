const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('/access.log', (req, res) => {
  res.sendFile(path.join(__dirname, 'access.log'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`[+] Challenge 5 (Digital Forensics Log) server listening on port ${PORT}`);
});
