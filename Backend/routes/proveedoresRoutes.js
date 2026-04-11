const express = require("express");
const router = express.Router();
const controller = require("../controllers/proveedoresController");

// ✅ SIN repetir "categorias"
router.get("/", controller.getProveedores);
router.post("/", controller.createProveedor);

module.exports = router;