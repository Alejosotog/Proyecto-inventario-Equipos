const express = require("express");
const router = express.Router();
const controller = require("../controllers/equiposController");

router.get("/", controller.getEquipos);
router.post("/", controller.createEquipo);

module.exports = router;