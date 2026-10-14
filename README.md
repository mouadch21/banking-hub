
# BankingHubFrontend
# Banking Hub

Banking Hub is an academic full-stack banking application for managing customers, accounts, balances, and transactions. It includes an Angular web client and a Spring Boot REST API backed by MySQL.

> **Academic demo only.** This project is not designed or audited for real financial activity or production banking use.

## Features

- Customer creation, editing, search, and deletion
- Bank account creation, account details, and account history
- Deposit, withdrawal, and account-to-account transfer workflows
- Transaction list and per-account transaction history
- Currency-aware balance summaries; balances in different currencies are shown separately and are not converted
- REST API documentation through Swagger UI

## Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | Angular 22, TypeScript, Bootstrap 5, Bootstrap Icons |
| Backend | Java 17, Spring Boot 3, Spring Web, Spring Data JPA |
| Database | MySQL |
| API docs | Springdoc OpenAPI / Swagger UI |
| Frontend tests | Vitest through Angular CLI |
| Backend tests | JUnit 5 and Spring Boot Test |

## Repository Structure

```text
.
├── backend/
│   └── banking-hub/       # Spring Boot API and MySQL schema
├── src/                   # Angular application
├── angular.json
├── package.json
└── README.md
```

## Requirements

- Node.js `22.22.3+` or `24.15.0+`, with npm `8+`
- Java 17
- MySQL server and the MySQL command-line client or Workbench

## Local Setup

### 1. Prepare the database

Start MySQL and execute the schema and sample-data script:

```text
backend/banking-hub/docs/banking_database.sql
```

The script creates the `banking_db` database, its tables, and sample customers and accounts. The backend uses Hibernate validation, so the schema must exist before the API starts.

### 2. Configure and start the backend

The local defaults in `backend/banking-hub/src/main/resources/application.properties` target MySQL at `localhost:3306`, database `banking_db`, user `root`, and an empty password. Override them for your environment rather than committing credentials.

PowerShell:

```powershell
$env:SPRING_DATASOURCE_URL = "jdbc:mysql://localhost:3306/banking_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
$env:SPRING_DATASOURCE_USERNAME = "root"
$env:SPRING_DATASOURCE_PASSWORD = "your-local-password"
cd backend\banking-hub
.\mvnw.cmd spring-boot:run
```

macOS/Linux:

```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/banking_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="your-local-password"
cd backend/banking-hub
./mvnw spring-boot:run
```

The API listens on `http://localhost:8080` by default. Swagger UI is available at `http://localhost:8080/swagger-ui/index.html`.

### 3. Start the frontend

From the repository root, in a separate terminal:

```bash
npm install
npm start
```

Open `http://localhost:4200`. The frontend currently calls the API at `http://localhost:8080`; update the API service URLs if the backend runs elsewhere.

## API Overview

All routes use the `/api/v1` prefix.

| Resource | Routes |
| --- | --- |
| Customers | `GET/POST /customers`, `GET/PUT/DELETE /customers/{id}` |
| Accounts | `GET/POST /accounts`, `GET/DELETE /accounts/{id}`, `PUT /accounts/{id}/status` |
| Transactions | `GET /transactions`, `POST /transactions/deposit`, `POST /transactions/withdraw`, `POST /transactions/transfer` |
| Account history | `GET /transactions/account/{accountId}/history` |

API responses use a JSON envelope containing `success`, `message`, and `data`.

## Testing and Build

Frontend, from the repository root:

```bash
npm test -- --watch=false
npm run build
```

Backend, from `backend/banking-hub`:

```bash
./mvnw test
./mvnw package
```

On Windows, use `mvnw.cmd` instead of `./mvnw`.

## Notes

- The current frontend API URLs are configured directly in the Angular API services for local development.
- The backend permits cross-origin requests broadly for development. Restrict CORS origins and configure authentication before exposing it beyond a trusted academic environment.
- Never commit real database passwords, API keys, or private customer data.
