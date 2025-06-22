# Beshara Group Technical Task

## Demo

You can view a live demo of the application at: [Demo Link](https://drive.google.com/file/d/1RBocuTEX1lG3TYF2cYGWwVy2HJTnOEKb/view)

## Project Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL server (installed and running)
- NestJS CLI (`npm i -g @nestjs/cli`)

## Installation & Running the Application

### 1. Clone the Repository

```bash
git clone https://github.com/omar1Mayallo/Beshara.git
```

### 2. Backend Setup (NestJS)

```bash
cd server
```

#### Configuration:

1. Create a `.env` file based on the provided `.env.example`
2. Update the environment variables with your PostgreSQL credentials

#### Run the backend:

```bash
npm run start:full
```

This command will:

- Install all dependencies
- Create the database (as specified in your `.env`)
- Run all database migrations
- Seed the database with initial data
- Start the development server on port 3001

### 3. Frontend Setup (Next.js)

```bash
cd ../client
```

#### Configuration:

1. Create a `.env` file based on the provided `.env.example`
2. Ensure `NEXT_PUBLIC_API_URL` points to your backend (default: `http://localhost:3001`)

#### Run the frontend:

```bash
npm install
npm run dev
```

The Next.js application will start on port 3000 by default.

## API Documentation

View the complete API reference in Postman .. see `api-doc.txt` file

## Features Implemented

All requirements completed:

- **Authentication & Authorization** with Login and Register functionality
- **Home Page** with:
  - Categories section
  - Featured Products
  - Products by Category
- **Product Details Page**
- **Cart Page** with Add to Cart functionality

## Troubleshooting

If you encounter issues:

1. Verify the `NEXT_PUBLIC_API_URL` in your frontend matches your backend URL

For database connection issues:

1. Verify PostgreSQL is running
2. Confirm your `.env` credentials are correct
3. Check the port numbers match between your configuration and running services
