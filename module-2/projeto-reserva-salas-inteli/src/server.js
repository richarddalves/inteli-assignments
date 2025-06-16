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

// Middleware específico para o favicon
app.get("/images/favicon.ico", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "image/x-icon");
  res.sendFile(path.join(__dirname, "../public/images/favicon.ico"));
});

// Configuração da sessão
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "sessions",
      createTableIfMissing: true,
      pruneSessionInterval: 60, // Limpa sessões expiradas a cada 60 segundos
    }),
    secret: process.env.SESSION_SECRET || "sua-chave-secreta",
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false, // Alterado para false em desenvolvimento
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    },
    rolling: true
  })
);

// Middleware para disponibilizar dados do usuário em todas as views
app.use((req, res, next) => {
  // Garante que o objeto user está disponível em todas as views
  res.locals.user = req.session.user || null;
  
  // Adiciona um helper para verificar se o usuário está autenticado
  res.locals.isAuthenticated = !!req.session.user;
  
  // Log para debug
  console.log('Session state:', {
    hasUser: !!req.session.user,
    userId: req.session.user?.user_id,
    path: req.path,
    sessionID: req.sessionID,
    cookie: req.session.cookie
  });
  
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
