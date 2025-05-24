// ./config/database.js
require("dotenv").config();

const { Pool } = require("pg");

// Criando a pool de conexões
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
  }
      : false,
});

// Evento de erro na conexão
pool.on("error", (err) => {
  console.error("Erro inesperado na conexão com o banco de dados:", err);
  process.exit(-1);
});

// Função para executar queries
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error("Erro ao executar query:", error);
    throw error;
  }
};

// Função para executar transações
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // Sobrescreve o método query para logar as queries
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  // Sobrescreve o método release para logar a liberação do cliente
  client.release = () => {
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
};

// Função para verificar a conexão
const checkConnection = async () => {
  try {
    const result = await query("SELECT NOW()");
    return {
      connected: true,
      timestamp: result.rows[0].now,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
};

module.exports = {
  query,
  getClient,
  checkConnection,
};
