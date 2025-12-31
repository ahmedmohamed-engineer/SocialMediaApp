# Smart Code Module 11

This is a simple Node.js application with a PostgreSQL database.

## Prerequisites

- Node.js
- npm
- PostgreSQL

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**

   - Make sure you have PostgreSQL installed and running.
   - Create a database and a user.
   - Create a `.env` file in the root of the project and add the following environment variables:

     ```
     DB_HOST=localhost
     DB_USER=<your-database-user>
     DB_PASSWORD=<your-database-password>
     DB_NAME=<your-database-name>
     DB_PORT=5432
     ```

4. **Run the application:**

   ```bash
   npm run dev
   ```

   This will start the application in development mode. The server will be running on `http://localhost:3000`.

## Available Scripts

- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run start`: Starts the application from the compiled code.
- `npm run dev`: Starts the application in development mode with watch mode enabled.
- `npm run watch`: Watches for changes in the TypeScript code and recompiles it.
- `npm run populate-db`: Populates the database with dummy data.
- `npm run resetAndSeed`: Resets the database and seeds it with initial data.
