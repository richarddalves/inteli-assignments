// Rotas relacionadas às operações de usuários
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/UsuarioController");

// Listar todos os usuários
router.get("/", usuarioController.listarUsuarios);

// Buscar usuário por ID
router.get("/:user_id", usuarioController.buscarUsuario);

// Criar novo usuário
router.post("/", usuarioController.criarUsuario);

// Atualizar usuário
router.put("/:user_id", usuarioController.atualizarUsuario);

// Deletar usuário
router.delete("/:user_id", usuarioController.deletarUsuario);

module.exports = router;
