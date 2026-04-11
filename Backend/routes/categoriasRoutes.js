const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoriasController");

// ✅ SIN repetir "categorias"
router.get("/", controller.getCategorias);
router.post("/", controller.createCategoria);

module.exports = router;