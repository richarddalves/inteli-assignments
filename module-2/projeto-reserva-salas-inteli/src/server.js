// ./server.js

const express = require("express");
require("dotenv").config();
const path = require("path");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Middleware para processar dados de formulário
app.use(express.urlencoded({ extended: true }));

// Configurando o EJS como view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configurando o middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Middleware para tratamento de CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

// Rotas
app.use("/", routes);

// Função para iniciar o servidor
const startServer = async (port) => {
  try {
    // Verificar conexão com o banco antes de iniciar o servidor
    const db = require("./config/db");
    const dbStatus = await db.checkConnection();

    if (!dbStatus.connected) {
      console.error("Erro ao conectar com o banco de dados:", dbStatus.error);
      process.exit(1);
    }

    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      console.log(`Porta ${port} em uso, tentando porta ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error("Erro ao iniciar o servidor:", error);
      process.exit(1);
    }
  }
};

// Inicializa o servidor apenas se não estiver em ambiente de teste
if (process.env.NODE_ENV !== "test") {
  startServer(PORT);
}

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "Página não encontrada",
    message: "A página que você está procurando não existe.",
  });
});

// Tratamento de erros 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("errors/500", {
    title: "Erro interno do servidor",
    message:
      "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
  });
});

// Tratamento de erros não capturados
process.on("uncaughtException", (err) => {
  console.error("Erro não capturado:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Promessa rejeitada não tratada:", err);
  process.exit(1);
});

module.exports = app;
