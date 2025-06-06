// ./config/database.js
require("dotenv").config();

const { Pool } = require("pg");

// Criando a pool de conexões
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  // Configurações adicionais para melhor estabilidade
  max: 20, // número máximo de clientes no pool
  idleTimeoutMillis: 30000, // tempo máximo que um cliente pode ficar inativo
  connectionTimeoutMillis: 5000, // tempo máximo para estabelecer conexão
  maxUses: 7500, // número máximo de vezes que uma conexão pode ser reutilizada
  keepAlive: true, // mantém a conexão viva
  keepAliveInitialDelayMillis: 10000, // tempo inicial para começar a manter a conexão viva
});

// Evento de erro na conexão
pool.on("error", (err) => {
  console.error("Erro inesperado na conexão com o banco de dados:", err);
});

// Função para executar queries com retry
const query = async (text, params, retries = 3) => {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      try {
        const res = await client.query(text, params);
        return res;
      } finally {
        client.release();
      }
    } catch (error) {
      lastError = error;
      console.error(`Tentativa ${i + 1} falhou:`, error);

      // Se não for o último retry, espera um pouco antes de tentar novamente
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError;
};

// Função para verificar a conexão
const checkConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    console.error("Erro ao verificar conexão:", error);
    return false;
  }
};

// Verifica a conexão periodicamente
setInterval(async () => {
  const isConnected = await checkConnection();
  if (!isConnected) {
    console.log("Tentando reconectar ao banco de dados...");
  }
}, 30000);

module.exports = {
  query,
  pool,
  checkConnection,
};
