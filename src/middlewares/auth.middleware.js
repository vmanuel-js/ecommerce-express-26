export const soloAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error:
        "Acceso denegado. Solo administradores pueden realizar esta acción",
    });
  }

  next();
};

export const soloUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  if (req.user.role !== "user") {
    return res.status(403).json({
      error: "Acceso denegado. Solo usuarios pueden realizar esta acción",
    });
  }

  next();
};

export const autorizar = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({
        error: `Acceso denegado. Se requiere uno de los siguientes roles ${rolesPermitidos.join(", ")}`,
      });
    }

    next();
  };
};
