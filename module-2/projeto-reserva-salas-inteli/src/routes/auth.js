const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db");

// Rota para exibir página de login
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("pages/login", { title: "Login" });
});

// Rota para exibir página de registro
router.get("/registro", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("pages/registro", { title: "Registro" });
});

// Rota para processar login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "E-mail ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(senha, user.password);

    if (!senhaValida) {
      return res.status(401).json({ message: "E-mail ou senha inválidos" });
    }

    // Remove a senha do objeto do usuário antes de salvar na sessão
    const { password, ...userWithoutPassword } = user;
    req.session.user = userWithoutPassword;

    res.json({ message: "Login realizado com sucesso" });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});

// Rota para processar registro
router.post("/registro", async (req, res) => {
  const { name, email, registration_number, password } = req.body;

  try {
    // Verifica se o e-mail já está em uso
    const emailExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: "E-mail já está em uso" });
    }

    // Verifica se a matrícula já está em uso
    const matriculaExists = await db.query(
      "SELECT * FROM users WHERE registration_number = $1",
      [registration_number]
    );

    if (matriculaExists.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Número de matrícula já está em uso" });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insere o novo usuário
    await db.query(
      "INSERT INTO users (name, email, registration_number, password, role) VALUES ($1, $2, $3, $4, $5)",
      [name, email, registration_number, hashedPassword, "user"]
    );

    res.json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

// Rota para logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
