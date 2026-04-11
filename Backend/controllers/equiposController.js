const model = require("../models/equiposModel");

exports.getEquipos = (req, res) => {
    model.getEquipos((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.createEquipo = (req, res) => {
    model.createEquipo(req.body, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: "✅ Equipo agregado correctamente" });
    });
};