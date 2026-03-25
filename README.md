# Graphql (Client + Server)



- `Graphql-server/`: Express + Apollo Server (GraphQL) + MongoDB (Mongoose)
- `Graphql-client/`: Next.js (App Router) + Apollo Client UI

## Features

- GraphQL API for **Users** and **Subjects**
  - Users can reference multiple subjects
  - Passwords are hashed with `bcrypt` before saving
- Next.js UI pages
  - `http://localhost:3000`: CRUD UI for users + subjects
  - `http://localhost:3000/apollo`: Embedded Apollo Sandbox pointed at the local API
- (Optional) Chat UI using WebSockets (client code exists, backend WS server is not implemented yet)

## Prerequisites

- Node.js (recommended: 18+)
- MongoDB running locally (or a remote MongoDB connection string)

## Quick Start (Local)

### 1) Start the server

```bash
cd Graphql-server
npm install
cp .env.example .env
npm run dev
```

Server runs on `http://localhost:8080` and GraphQL is available at `http://localhost:8080/graphql`.

### 2) Start the client

```bash
cd Graphql-client
npm install
npm run dev
```

Client runs on `http://localhost:3000`.

## Environment Variables

### Server (`Graphql-server/.env`)

- `MONGO_URI` (required): MongoDB connection string

Example:

```env
MONGO_URI=mongodb://localhost:27017/chatApp
```

## GraphQL API

Endpoint: `http://localhost:8080/graphql`

### Queries

```graphql
query Users {
  users {
    id
    name
    email
    image
    subjects {
      id
      name
    }
  }
}
```

```graphql
query Subjects {
  subjects {
    id
    name
  }
}
```

```graphql
query UserById($id: ID!) {
  userById(id: $id) {
    id
    name
    email
    image
    subjects {
      id
      name
    }
  }
}
```

### Mutations

```graphql
mutation NewSubject($name: String!) {
  newSubject(name: $name) {
    id
    name
  }
}
```

```graphql
mutation NewUser(
  $name: String!
  $email: String!
  $password: String!
  $image: String
  $subjects: [ID]
) {
  newUser(
    name: $name
    email: $email
    password: $password
    image: $image
    subjects: $subjects
  ) {
    id
    name
    email
    image
    subjects {
      id
      name
    }
  }
}
```

```graphql
mutation UpdateUser(
  $id: ID!
  $name: String
  $email: String
  $password: String
  $image: String
  $subjects: [ID]
) {
  updateUser(
    id: $id
    name: $name
    email: $email
    password: $password
    image: $image
    subjects: $subjects
  ) {
    id
    name
    email
    image
    subjects {
      id
      name
    }
  }
}
```

```graphql
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    id
  }
}
```

```graphql
mutation EditSubject($id: ID!, $name: String!) {
  editSubject(id: $id, name: $name) {
    id
    name
  }
}
```

```graphql
mutation DeleteSubject($id: ID!) {
  deleteSubject(id: $id) {
    id
  }
}
```

## Notes

- The client is currently hardcoded to talk to `http://localhost:8080/graphql` in `Graphql-client/lib/apolloClient.ts`.
- If you change the server port, update the client URL accordingly.

## Scripts

### Server (`Graphql-server/`)

- `npm run dev`: starts the API with `nodemon` on port `8080`

### Client (`Graphql-client/`)

- `npm run dev`: start Next.js dev server (stable dev; disables Turbopack)
- `npm run dev:turbo`: start Next.js dev server with Turbopack
- `npm run clean`: remove `.next` cache/output
- `npm run build`: build for production
- `npm run start`: start the production server (after build)

## Production (Basic)

- Server: run `node index.js` with `MONGO_URI` set in the environment.
- Client: run `npm run build` then `npm run start`.
