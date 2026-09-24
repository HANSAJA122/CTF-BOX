# CyberVault CTF Platform

> **University Penetration Testing Project** | SLIIT IE3132 - Penetration Testing

A web-based cybersecurity Capture The Flag (CTF) Play Box platform built with React.js, Node.js, Express, MongoDB, and Docker containers.

---

## 🏗️ Architecture & Stack

```
                          +-------------------+
                          |   User Browser    |
                          +---------+---------+
                                    | HTTP / Web
                                    v
                          +-------------------+
                          |  React Frontend   | (Port 3000)
                          +---------+---------+
                                    | REST API (JWT Auth)
                                    v
                          +-------------------+
                          |  Node.js Backend  | (Port 5001)
                          +----+--------+-----+
                               |        |
                        MongoDB|        | Docker Isolated Bridge
                               v        v
                      +------------------+  +--------------------------------+
                      | MongoDB Database |  | Docker Challenge Containers    |
                      | (Mongo 7.0)      |  | - Ch1: OSINT Web (3001)        |
                      +------------------+  | - Ch2: Stego Web (3002)        |
                                            | - Ch3: SQLi Web (3003)        |
                                            | - Ch4: Caesar Cipher (3004)    |
                                            | - Ch5: Log Analysis (3005)     |
                                            | - Ch6: Linux PrivEsc (3006)    |
                                            +--------------------------------+
```

### Stack Components
- **Frontend**: React.js, React Router, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Mongoose
- **Database**: MongoDB 7.0
- **Containerization**: Docker & Docker Compose V2

---

## 🚩 6 Cybersecurity Stages

| Stage | Domain | Difficulty | Points | Target Port | Secret Flag |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Stage 1** | OSINT Reconnaissance | Easy | 100 | `3001` | `flag{os1nt_r3con_m4st3r_2026}` |
| **Stage 2** | Steganography | Easy | 150 | `3002` | `flag{st3g0_h1dd3n_1n_pl41n_s1ght}` |
| **Stage 3** | Web Security SQLi | Medium | 250 | `3003` | `flag{sql1_3xp1o1t3d_5ucce55fully}` |
| **Stage 4** | Cryptography Caesar Cipher | Medium | 300 | `3004` | `flag{caesar_cipher_decoded}` |
| **Stage 5** | Digital Forensics | Hard | 400 | `3005` | `flag{f0r3ns1cs_l0g_4n4lys1s_pr0}` |
| **Stage 6** | Linux Privilege Escalation | Hard | 500 | `3006` | `flag{l1nux_pr1v_3sc4l4t10n_r00t}` |

---

## 🚀 Quick Start Guide

```bash
# 1. Clone the repository
git clone https://github.com/HANSAJA122/CTF-BOX.git
cd CTF-BOX

# 2. Build & launch containers
docker compose up --build -d

# 3. Seed MongoDB database with initial CTF stages & accounts
docker compose exec backend npm run seed
```

Access the UI at `http://localhost:3000`.

### Demo Credentials
- **Student**: `student@cybervault.edu` / `StudentPassword123!`
- **Admin**: `admin@cybervault.edu` / `AdminPassword123!`

---
