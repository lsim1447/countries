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

Note: You may need to update the DATABASE_URL to point to your local DB. Once it is done, you'll have to execute the following commands:

```bash
npx prisma migrate dev --name init
npx prisma generate

```

#### Start Dev Server

```bash
npx ts-node-dev src/index.ts
```

OR

```bash
npm run start
```

#### Endpoints

```bash
GET /fetch-countries: Fetch and store all countries
GET /countries: List all countries
POST /countries: Add new country
PUT /countries/{id}: Update country
DELETE /countries/{id}: Delete country
```

## 📚 API Usage Examples

### Fetch and Store Countries

```bash
GET http://localhost:3000/fetch-countries
```

### List Countries with Filters

#### Basic List

```bash
GET http://localhost:3000/countries
```

#### Search by Name or Capital

```bash
GET http://localhost:3000/countries?search=Kuwait
```

#### Filter by Region

```bash
GET http://localhost:3000/countries?region=Europe
```

#### Sort Results

```bash
# Sort by name (ascending)
GET http://localhost:3000/countries?sort=name&order=asc

# Sort by population (descending)
GET http://localhost:3000/countries?sort=population&order=desc
```

#### Pagination

```bash
# Get first page with 10 items
GET http://localhost:3000/countries?page=1&limit=10

# Get second page with 20 items
GET http://localhost:3000/countries?page=2&limit=20
```

#### Combined Filters

```bash
# Search for "land" in Europe, sorted by population descending, page 1 with 5 results
GET http://localhost:3000/countries?search=land&region=Europe&sort=population&order=desc&page=1&limit=5
```

### Create a New Country

```bash
POST http://localhost:3000/countries
Content-Type: application/json

{
  "name": "San Marino",
  "capital": "New Capital",
  "region": "Europe",
  "population": 1000000,
  "flag": "https://example.com/flag.png"
}
```

### Update a Country

```bash
PUT http://localhost:3000/countries/1
Content-Type: application/json

{
  "population": 2000000
}
```

### Delete a Country

```bash
DELETE http://localhost:3000/countries/1
```
