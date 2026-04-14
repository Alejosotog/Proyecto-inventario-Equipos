const express = require("express");
const router = express.Router();
const controller = require("../controllers/prestamosController");

router.post("/prestamos", controller.crearPrestamo);
router.get("/prestamos", controller.obtenerPrestamos);
router.put("/prestamos/:id", controller.devolverEquipo);

module.exports = router;