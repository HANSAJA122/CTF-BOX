const fs = require('fs');

const logLines = [
  '192.168.1.10 - - [15/Sep/2026:10:14:02 +0000] "GET /index.html HTTP/1.1" 200 4523 "-" "Mozilla/5.0"',
  '192.168.1.15 - - [15/Sep/2026:10:14:25 +0000] "GET /about.html HTTP/1.1" 200 3104 "-" "Mozilla/5.0"',
  '10.0.0.45 - - [15/Sep/2026:10:15:11 +0000] "GET /login.php HTTP/1.1" 200 1820 "-" "Mozilla/5.0"',
  '10.0.0.45 - - [15/Sep/2026:10:15:40 +0000] "POST /login.php HTTP/1.1" 302 450 "-" "Python-urllib/3.9"',
  '10.0.0.45 - - [15/Sep/2026:10:16:01 +0000] "GET /admin/dashboard HTTP/1.1" 403 230 "-" "Python-urllib/3.9"',
  '10.0.0.45 - - [15/Sep/2026:10:16:15 +0000] "GET /admin/config.bak HTTP/1.1" 200 8920 "-" "curl/7.68.0"',
  '10.0.0.45 - - [15/Sep/2026:10:17:02 +0000] "GET /exfiltrate.php?session_id=89123&FLAG=ZmxhZ3tmMHJlbnMxY3NfbDBnXzRuNGx5czFzX3ByMH0= HTTP/1.1" 200 120 "-" "curl/7.68.0"',
  '192.168.1.10 - - [15/Sep/2026:10:18:44 +0000] "GET /contact.html HTTP/1.1" 200 2100 "-" "Mozilla/5.0"',
  '192.168.1.22 - - [15/Sep/2026:10:19:30 +0000] "GET /favicon.ico HTTP/1.1" 404 150 "-" "Mozilla/5.0"',
];

fs.writeFileSync(__dirname + '/access.log', logLines.join('\n') + '\n');
console.log('[+] Generated access.log for forensics challenge');
