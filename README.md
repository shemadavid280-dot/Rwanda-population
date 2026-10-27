# Rwanda Population Management System (RPMS) — React Full-Stack

Includes React + Vite frontend, Express API, MySQL/MariaDB database schema, JWT authentication, dashboard statistics, resident CRUD, locations, verification queue, health facility directory, audit log and CSV export.

## Requirements
- Node.js 20+
- XAMPP MySQL/MariaDB
- VS Code

## 1. Database
Start MySQL in XAMPP. Open `http://localhost/phpmyadmin`, choose SQL, and run `database/schema.sql`, then optionally run `database/seed.sql`. The database is `rwanda_population_react`, separate from your older PHP project.

## 2. Backend
Open terminal at project root:
```bash
cd server
npm install
```
Copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`). Check DB settings, then:
```bash
npm run seed:admin
npm run dev
```
API health: `http://localhost:5000/api/health`
Development login: username `admin`, password `ChangeMe123!`. Change this password before using real data.

## 3. Frontend
Open a second terminal:
```bash
cd client
npm install
```
Copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`), then:
```bash
npm run dev
```
Open the local URL Vite prints, usually `http://localhost:5173`.

## Features
- JWT login/logout
- Overview dashboard using live database aggregates
- Resident register: search, add, edit, archive, verification state, CSV export
- Location hierarchy from province to village
- Verification queue
- Health facilities directory
- Audit log view
- SQL schema and demo location seed

## Important security notes
This is a development starter, not a production-ready national registry. Use synthetic data during testing. Do not commit `.env`, passwords, real resident data or national ID data. Before deployment, use a strong JWT secret, change the admin password, restrict CORS, enable HTTPS, enforce administrative scope/permissions, back up the database and review applicable privacy requirements.
