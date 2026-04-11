const express = require("express");
const router = express.Router();
const controller = require("../controllers/marcasController");

// ✅ SIN repetir "categorias"
router.get("/", controller.getMarcas);
router.post("/", controller.createMarca);

module.exports = router;