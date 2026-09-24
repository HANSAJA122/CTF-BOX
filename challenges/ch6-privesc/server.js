const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Interactive Web Shell Execution Endpoint
app.post('/api/terminal', (req, res) => {
  const { command } = req.body;

  if (!command || typeof command !== 'string') {
    return res.status(400).json({ output: 'Error: No command provided.' });
  }

  const cmdLower = command.trim().toLowerCase();

  // Simulated privilege escalation / SUID execution
  if (cmdLower === 'find / -perm -4000 2>/dev/null' || cmdLower.includes('-perm -4000')) {
    return res.json({
      output: `/usr/bin/passwd\n/usr/bin/newgrp\n/usr/bin/gpasswd\n/usr/bin/custom_vault_reader (SUID ROOT)`
    });
  }

  if (cmdLower.includes('custom_vault_reader') || cmdLower === 'sudo cat /root/flag.txt' || cmdLower.includes('cat /root/flag.txt')) {
    return res.json({
      output: `[+] Executing /usr/bin/custom_vault_reader with SUID ROOT privileges...\n[+] READING /root/flag.txt:\n\nflag{l1nux_pr1v_3sc4l4t10n_r00t}`
    });
  }

  if (cmdLower === 'whoami') {
    return res.json({ output: 'user' });
  }

  if (cmdLower === 'id') {
    return res.json({ output: 'uid=1000(user) gid=1000(user) groups=1000(user)' });
  }

  if (cmdLower === 'ls' || cmdLower === 'ls -la') {
    return res.json({ output: 'drwxr-xr-x 2 user user 4096 Sep 15 10:00 .\n-rw-r--r-- 1 user user  220 Sep 15 10:00 notes.txt' });
  }

  if (cmdLower === 'cat notes.txt') {
    return res.json({ output: 'Check for SUID binaries on the system to gain root access: find / -perm -4000 2>/dev/null' });
  }

  if (cmdLower === 'sudo -l') {
    return res.json({ output: 'User user may run the following commands on target:\n    (root) NOPASSWD: /usr/bin/custom_vault_reader' });
  }

  // Safe execution of basic helper commands
  exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
    if (error) {
      return res.json({ output: stderr || error.message });
    }
    res.json({ output: stdout || '(No output returned)' });
  });
});

const PORT = 3006;
app.listen(PORT, () => {
  console.log(`[+] Challenge 6 (Linux PrivEsc) server listening on port ${PORT}`);
});
