// Middleware para verificar se o usuário está autenticado
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  // Se a requisição for AJAX/JSON, retorna erro 401
  if (req.xhr || req.headers.accept.indexOf("json") > -1) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  // Caso contrário, redireciona para a página de login
  res.redirect("/auth/login");
}

module.exports = { isAuthenticated };
