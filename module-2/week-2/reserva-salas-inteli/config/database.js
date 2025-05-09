// ./config/database.js
require("dotenv").config();

const { Pool } = require("pg");
const isSSL = process.env.DB_SSL === "true";

// Criando a pool de conexões
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
