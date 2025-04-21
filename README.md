# 🌍 Country Explorer API

A TypeScript + Hapi.js API that fetches country data from the REST Countries API, stores it in a PostgreSQL database, and provides full CRUD endpoints.

## 🚀 Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Setup

```bash
git clone <repo>
cd country-explorer-api
npm install
npx prisma migrate dev --name init
```

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/country_explorer"
```

#### Start Dev Server

```bash
npx ts-node-dev src/index.ts
```

#### Endpoints

```bash
GET /fetch-countries: Fetch and store all countries
GET /countries: List all countries

POST /countries: Add new country

PUT /countries/{id}: Update country

DELETE /countries/{id}: Delete country
```
