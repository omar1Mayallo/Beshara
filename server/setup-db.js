const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

async function setupDatabase() {
  try {
    await client.connect();
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created successfully`);
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await client.end();
  }
}

setupDatabase();
