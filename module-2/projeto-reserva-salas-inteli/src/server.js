// ./server.js

const express = require("express");
require("dotenv").config();
const path = require("path");
const routes = require("./routes");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { pool } = require("./config/db");

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

// Configuração da sessão
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "sessions",
    }),
    secret: process.env.SESSION_SECRET || "sua-chave-secreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// Middleware para disponibilizar dados do usuário em todas as views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

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
async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
}

// Inicializa o servidor apenas se não estiver em ambiente de teste
if (process.env.NODE_ENV !== "test") {
  startServer();
}

// Tratamento de erros 404
app.use((req, res, next) => {
  res.status(404).render("errors/404", {
    title: "Página não encontrada",
    message: "A página que você está procurando não existe.",
  });
});

// Tratamento de erros 500
app.use((err, req, res, next) => {
  console.error("Erro:", err);
  res.status(500).render("errors/500", {
    title: "Erro interno",
    message: "Ocorreu um erro interno no servidor.",
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
