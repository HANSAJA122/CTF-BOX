const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Submission = require('../models/Submission');

dotenv.config({ path: __dirname + '/../.env' });

const initialChallenges = [
  {
    title: 'OSINT Reconnaissance',
    category: 'OSINT Reconnaissance',
    difficulty: 'Easy',
    points: 100,
    containerPort: 3001,
    dockerImage: 'cybervault-ch1-osint',
    serviceUrl: 'http://localhost:3001',
    description:
      'Target Company "CyberCorp Global" has published an internal portal preview. Your goal is to inspect the public webpage source code, metadata, and hidden server directories to uncover sensitive employee credentials and the secret flag.',
    flag: 'flag{os1nt_r3con_m4st3r_2026}',
    hints: [
      { content: 'Inspect HTML page comments (`<!-- ... -->`) and check standard web files like `robots.txt`.', cost: 0 },
      { content: 'Look at the Developer Console logs or `/secret_admin_notes.txt`.', cost: 20 },
    ],
  },
  {
    title: 'Steganography - Hidden In Plain Sight',
    category: 'Steganography',
    difficulty: 'Easy',
    points: 150,
    containerPort: 3002,
    dockerImage: 'cybervault-ch2-stego',
    serviceUrl: 'http://localhost:3002',
    description:
      'An intelligence agent transmitted a confidential image file named `secret_vault.png`. The flag is hidden inside the metadata and pixel payload of the image. Download the image from the challenge web port and analyze it using `exiftool` or `strings`.',
    flag: 'flag{st3g0_h1dd3n_1n_pl41n_s1ght}',
    hints: [
      { content: 'Use the `strings` command or `exiftool` on the downloaded image file.', cost: 0 },
      { content: 'Command: `strings secret_vault.png | grep flag`', cost: 25 },
    ],
  },
  {
    title: 'Web Security - SQL Injection',
    category: 'Web Security',
    difficulty: 'Medium',
    points: 250,
    containerPort: 3003,
    dockerImage: 'cybervault-ch3-sqli',
    serviceUrl: 'http://localhost:3003',
    description:
      'The administrative login portal of CyberVault is vulnerable to SQL Injection (SQLi) due to unsafe string concatenation in its database query. Bypass the authentication check to gain administrator access and retrieve the flag.',
    flag: 'flag{sql1_3xp1o1t3d_5ucce55fully}',
    hints: [
      { content: "Try entering a classic SQL injection payload in the username field such as `' OR '1'='1`.", cost: 0 },
      { content: "Use `' OR '1'='1' --` to comment out the remainder of the SQL query.", cost: 50 },
    ],
  },
  {
    title: 'Cryptography - Ancient Caesar Cipher',
    category: 'Cryptography',
    difficulty: 'Medium',
    points: 300,
    containerPort: 3004,
    dockerImage: 'cybervault-ch4-crypto',
    serviceUrl: 'http://localhost:3004',
    description:
      'An encrypted radio broadcast was intercepted containing the following ciphertext: `iodj{fdhoxu_flskhu_ghfrghg}`. The message was encrypted using a classic Caesar Cipher (ROT-N). Decrypt the ciphertext to reveal the flag format.',
    flag: 'flag{caesar_cipher_decoded}',
    hints: [
      { content: 'The Caesar Cipher shifts each letter in the alphabet by a fixed number of positions (e.g. key shift = 3).', cost: 0 },
      { content: 'Perform a ROT-23 shift or shift backwards by 3 positions (i -> f, o -> a, d -> c, j -> g).', cost: 50 },
    ],
  },
  {
    title: 'Digital Forensics - Apache Log Analysis',
    category: 'Digital Forensics',
    difficulty: 'Hard',
    points: 400,
    containerPort: 3005,
    dockerImage: 'cybervault-ch5-forensics',
    serviceUrl: 'http://localhost:3005',
    description:
      'A web server suffered a security incident. The system administrator preserved the raw HTTP access logs. Analyze the log file hosted on the challenge container to identify the attacker’s exfiltrated payload and locate the stolen flag.',
    flag: 'flag{f0r3ns1cs_l0g_4n4lys1s_pr0}',
    hints: [
      { content: 'Look for Base64 encoded query parameters in the GET requests within the access log file.', cost: 0 },
      { content: 'Command: `grep "FLAG=" access.log` or decode the Base64 string from the suspicious URL.', cost: 75 },
    ],
  },
  {
    title: 'Linux Privilege Escalation',
    category: 'Linux Security',
    difficulty: 'Hard',
    points: 500,
    containerPort: 3006,
    dockerImage: 'cybervault-ch6-privesc',
    serviceUrl: 'http://localhost:3006',
    description:
      'You are granted initial shell access as a low-privileged user (`user`) on a target Linux server. Search the filesystem for misconfigured SUID binaries or binary permissions to escalate privileges to `root` and read `/root/flag.txt`.',
    flag: 'flag{l1nux_pr1v_3sc4l4t10n_r00t}',
    hints: [
      { content: 'Search for SUID binaries using `find / -perm -4000 -type f 2>/dev/null`.', cost: 0 },
      { content: 'Look for the custom SUID binary `/usr/bin/find` or `/usr/bin/python3` with root privileges.', cost: 100 },
    ],
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cybervault_ctf';
    await mongoose.connect(mongoUri);
    console.log('[+] Connected to MongoDB for database seeding...');

    // Clear existing collections
    await Challenge.deleteMany({});
    await User.deleteMany({});
    await Submission.deleteMany({});

    console.log('[+] Cleared existing challenges, users, and submissions.');

    // Seed initial challenges
    const createdChallenges = await Challenge.insertMany(initialChallenges);
    console.log(`[+] Successfully seeded ${createdChallenges.length} CTF challenges.`);

    // Create default Admin account
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@cybervault.edu',
      password: 'AdminPassword123!',
      role: 'admin',
    });
    console.log(`[+] Admin account created: username=admin, email=admin@cybervault.edu, password=AdminPassword123!`);

    // Create default Demo Student account
    const studentUser = await User.create({
      username: 'cyber_student',
      email: 'student@cybervault.edu',
      password: 'StudentPassword123!',
      role: 'user',
      score: 0,
    });
    console.log(`[+] Student account created: username=cyber_student, email=student@cybervault.edu, password=StudentPassword123!`);

    console.log('[+] Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[-] Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
